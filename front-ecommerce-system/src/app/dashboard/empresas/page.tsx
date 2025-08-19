"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DataTable from "@/components/dashboard/DataTable";
import { BuildingOfficeIcon } from "@/components/icons";
import ChangeStatusModal from "@/components/modals/ChangeStatusModal";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Empresa extends Record<string, unknown> {
  id: number;
  nome: string;
  email: string;
  status: string;
  funcionarios: number;
}

export default function EmpresasPage() {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  const allEmpresas: Empresa[] = [
    {
      id: 1,
      nome: "Tech Solutions Ltd.",
      email: "contato@techsolutions.com",
      status: "Ativa",
      funcionarios: 45,
    },
    {
      id: 2,
      nome: "Commerce Inc.",
      email: "info@commerce.com",
      status: "Ativa",
      funcionarios: 23,
    },
    {
      id: 3,
      nome: "Digital World",
      email: "hello@digitalworld.com",
      status: "Inativa",
      funcionarios: 12,
    },
    {
      id: 4,
      nome: "Innovation Corp.",
      email: "contact@innovation.com",
      status: "Ativa",
      funcionarios: 67,
    },
    {
      id: 5,
      nome: "StartUp Solutions",
      email: "info@startup.com",
      status: "Ativa",
      funcionarios: 15,
    },
    {
      id: 6,
      nome: "Global Systems",
      email: "contato@global.com",
      status: "Inativa",
      funcionarios: 89,
    },
    {
      id: 7,
      nome: "Future Technologies",
      email: "hello@future.com",
      status: "Ativa",
      funcionarios: 34,
    },
    {
      id: 8,
      nome: "Smart Business",
      email: "contact@smart.com",
      status: "Ativa",
      funcionarios: 56,
    },
    {
      id: 9,
      nome: "Digital Innovations",
      email: "info@digital.com",
      status: "Inativa",
      funcionarios: 22,
    },
    {
      id: 10,
      nome: "Tech Ventures",
      email: "hello@techventures.com",
      status: "Ativa",
      funcionarios: 78,
    },
    {
      id: 11,
      nome: "Cloud Solutions",
      email: "contato@cloud.com",
      status: "Ativa",
      funcionarios: 45,
    },
    {
      id: 12,
      nome: "Data Analytics Corp",
      email: "info@dataanalytics.com",
      status: "Inativa",
      funcionarios: 91,
    },
  ];

  // Filtrar empresas baseado na busca
  const filteredEmpresas = allEmpresas.filter(
    (empresa) =>
      empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular paginação
  const totalPages = Math.ceil(filteredEmpresas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const empresas = filteredEmpresas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset para primeira página ao buscar
  };

  const handleEditEmpresa = (empresa: Empresa) => {
    router.push(`/dashboard/empresas/${empresa.id}`);
  };

  const handleDeleteEmpresa = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setShowDeleteModal(true);
  };

  const handleChangeStatus = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setShowStatusModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedEmpresa) {
      console.log("Excluindo empresa:", selectedEmpresa.nome);
      // Aqui você implementaria a lógica de exclusão
      setShowDeleteModal(false);
      setSelectedEmpresa(null);
    }
  };

  const handleConfirmStatusChange = (newStatus: string) => {
    if (selectedEmpresa) {
      console.log(
        "Alterando status da empresa:",
        selectedEmpresa.nome,
        "para:",
        newStatus
      );
      // Aqui você implementaria a lógica de alteração de status
      setShowStatusModal(false);
      setSelectedEmpresa(null);
    }
  };

  const columns = [
    {
      header: "Empresa",
      key: "nome",
      render: (value: unknown, item: Empresa) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <BuildingOfficeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {item.nome}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      key: "email",
      render: (value: unknown) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {String(value)}
        </div>
      ),
    },
    {
      header: "Funcionários",
      key: "funcionarios",
      render: (value: unknown) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {String(value)}
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (value: unknown) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            String(value) === "Ativa"
              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {String(value)}
        </span>
      ),
    },
    {
      header: "Ações",
      key: "actions",
      render: (value: unknown, item: Empresa) => (
        <div className="text-sm font-medium space-x-2">
          <button
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
            onClick={() => handleEditEmpresa(item)}
          >
            Editar
          </button>
          <button
            className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 cursor-pointer"
            onClick={() => handleChangeStatus(item)}
          >
            Status
          </button>
          <button
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer"
            onClick={() => handleDeleteEmpresa(item)}
          >
            Excluir
          </button>
        </div>
      ),
    },
  ];

  const handleNovaEmpresa = () => {
    router.push("/dashboard/empresas/nova");
  };

  return (
    <DashboardLayout
      currentPage="empresas"
      title="Empresas"
      subtitle="Gerencie as empresas cadastradas no sistema"
      actionButton={{
        label: "+ Nova Empresa",
        onClick: handleNovaEmpresa,
      }}
    >
      <DataTable<Empresa>
        title="Lista de Empresas"
        columns={columns}
        data={empresas}
        searchPlaceholder="Buscar empresas..."
        onSearch={handleSearchChange}
        showPagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={filteredEmpresas.length}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedEmpresa?.nome || ""}
      />

      <ChangeStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleConfirmStatusChange}
        currentStatus={selectedEmpresa?.status || ""}
        itemName={selectedEmpresa?.nome || ""}
      />
    </DashboardLayout>
  );
}
