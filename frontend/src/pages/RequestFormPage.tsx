import { Button, Card, Form, Input, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRequest } from '../services/api';
import { CreateRequest, RequestPriority } from '../types';

const priorityOptions: RequestPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const RequestFormPage = () => {
  const [form] = Form.useForm<CreateRequest>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      message.success('Talep oluşturuldu');
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      navigate('/requests');
    },
  });

  const onFinish = (values: CreateRequest) => mutation.mutate(values);

  return (
    <Card title="Yeni Talep" style={{ maxWidth: 600 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Başlık" rules={[{ required: true, max: 150 }]}> 
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Açıklama" rules={[{ required: true }]}> 
          <Input.TextArea rows={5} />
        </Form.Item>
        <Form.Item name="priority" label="Öncelik" rules={[{ required: true }]} initialValue="MEDIUM"> 
          <Select options={priorityOptions.map((priority) => ({ value: priority, label: priority }))} />
        </Form.Item>
        <Form.Item name="category" label="Kategori"> 
          <Input />
        </Form.Item>
        <Form.Item name="attachmentUrl" label="Dosya Linki"> 
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Kaydet
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

