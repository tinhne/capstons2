import React from "react";
import Button from "./Button";

interface ConfirmDeleteModalProps {
  open: boolean;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  message = "Bạn có chắc chắn muốn xóa bác sĩ này không?",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4 text-center text-red-600">
          Xác nhận xóa bác sĩ
        </h3>
        <p className="mb-6 text-center">{message}</p>
        <div className="flex gap-2 justify-center">
          <Button color="danger" onClick={onConfirm} disabled={loading}>
            Xóa
          </Button>
          <Button color="secondary" onClick={onCancel} disabled={loading}>
            Hủy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
