import { Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { RequestItem, RequestStatus, UpdateRequestStatus, UserSummary } from '../types';

interface Props {
  open: boolean;
  request?: RequestItem;
  onCancel: () => void;
  onSubmit: (values: UpdateRequestStatus) => void;
  loading?: boolean;
  admins?: UserSummary[];
}

const statusOptions: RequestStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export const RequestStatusModal = ({ open, request, onCancel, onSubmit, loading, admins = [] }: Props) => {
  const [form] = Form.useForm<UpdateRequestStatus>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        status: request?.status,
        assigneeId: request?.assigneeId,
        resolutionNote: request?.resolutionNote,
      });
    }
  }, [open, request, form]);

  return (
    <Modal
      open={open}
      title={`Durum Güncelle: ${request?.title ?? ''}`}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="status" label="Durum" rules={[{ required: true }]}> 
          <Select options={statusOptions.map((status) => ({ value: status, label: status }))} />
        </Form.Item>
        {admins.length > 0 && (
          <Form.Item name="assigneeId" label="Atanan">
            <Select
              allowClear
              placeholder="Admin seç"
              options={admins.map((admin) => ({ value: admin.id, label: `${admin.fullName} (${admin.email})` }))}
            />
          </Form.Item>
        )}
        <Form.Item name="resolutionNote" label="Çözüm Notu">
          <Input.TextArea rows={3} placeholder="Güncelleme detayları" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

