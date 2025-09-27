import { Button, Input, Modal, Select, Space, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAdmins, fetchRequests, updateRequestStatus } from '../services/api';
import { RequestItem, RequestPriority, RequestStatus, UpdateRequestStatus, UserSummary } from '../types';
import { RequestTable } from '../components/RequestTable';
import { RequestStatusModal } from '../components/RequestStatusModal';
import { DownloadOutlined } from '@ant-design/icons';
import { useAuth } from '../auth/AuthContext';
import './RequestsPage.css';

export const RequestsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const isAdmin = profile?.roles?.includes('ROLE_ADMIN') ?? false;
  const [selected, setSelected] = useState<RequestItem | undefined>();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<RequestPriority | undefined>();
  const [search, setSearch] = useState('');

  const { data: admins = [], error: adminsError } = useQuery<UserSummary[]>({
    queryKey: ['admins'],
    queryFn: fetchAdmins,
    enabled: isAdmin,
    retry: false,
  });

  const { data: requests = [], isLoading, error: requestError } = useQuery({
    queryKey: ['requests', statusFilter, priorityFilter, search],
    queryFn: () =>
      fetchRequests({
        status: statusFilter,
        priority: priorityFilter,
        q: search || undefined,
      }),
    retry: false,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRequestStatus }) => updateRequestStatus(id, data),
    onSuccess: () => {
      message.success('Talep güncellendi');
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      setStatusModalOpen(false);
    },
    onError: (err: any) => {
      message.error(err?.message ?? 'Talep güncellenemedi');
    },
  });

  const handleStatusUpdate = (request: RequestItem) => {
    setSelected(request);
    setStatusModalOpen(true);
  };

  const filteredAdmins = useMemo(() => admins ?? [], [admins]);

  useEffect(() => {
    if (requestError) {
      message.error(requestError.message || 'Talepler alınamadı');
    }
  }, [requestError]);

  useEffect(() => {
    if (adminsError) {
      message.error(adminsError.message || 'Admin listesi alınamadı');
    }
  }, [adminsError]);

  const handleExportCsv = () => {
    const headers = ['ID', 'Başlık', 'Açıklama', 'Durum', 'Öncelik', 'Kategori', 'Talep Eden', 'Atanan', 'Çözüm Notu'];
    const rows = requests.map((item) => [
      item.id,
      item.title,
      item.description,
      item.status,
      item.priority,
      item.category ?? '',
      item.requesterName ?? '',
      item.assigneeName ?? '',
      item.resolutionNote ?? '',
    ]);
    const csv = [headers, ...rows].map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `requests-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewDetails = (request: RequestItem) => {
    setSelected(request);
    setDetailModalOpen(true);
  };

  return (
    <div className="requests-page">
      <div className="requests-toolbar">
        <Typography.Title level={2} className="requests-title">
          Talepler
        </Typography.Title>
        <div className="filter-group">
          <Input
            placeholder="Ara..."
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select<RequestStatus | undefined>
            placeholder="Durum"
            allowClear
            style={{ width: 160 }}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => ({ value: status, label: status }))}
          />
          <Select<RequestPriority | undefined>
            placeholder="Öncelik"
            allowClear
            style={{ width: 160 }}
            value={priorityFilter}
            onChange={(val) => setPriorityFilter(val)}
            options={['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((priority) => ({ value: priority, label: priority }))}
          />
          <Button className="csv-button" icon={<DownloadOutlined />} onClick={handleExportCsv}>
            CSV
          </Button>
        </div>
        <Space>
          <Button type="primary" onClick={() => navigate('/requests/new')}>
            Yeni Talep
          </Button>
        </Space>
      </div>
      <RequestTable
        data={requests}
        loading={isLoading}
        onUpdateStatus={isAdmin ? handleStatusUpdate : undefined}
        onViewDetails={handleViewDetails}
      />
      <RequestStatusModal
        open={statusModalOpen}
        request={selected}
        onCancel={() => setStatusModalOpen(false)}
        onSubmit={(values) => selected && statusMutation.mutate({ id: selected.id, data: values })}
        loading={statusMutation.isPending}
        admins={isAdmin ? filteredAdmins : []}
      />
      <Modal
        open={detailModalOpen}
        title={selected?.title}
        onCancel={() => setDetailModalOpen(false)}
        footer={<Button onClick={() => setDetailModalOpen(false)}>Kapat</Button>}
      >
        <Typography.Paragraph>
          {selected?.description}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>Durum:</strong> {selected?.status}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>Çözüm Notu:</strong> {selected?.resolutionNote ?? '---'}
        </Typography.Paragraph>
        {selected?.attachmentUrl && (
          <Typography.Paragraph>
            Dosya: <a href={selected.attachmentUrl} target="_blank" rel="noopener noreferrer">{selected.attachmentUrl}</a>
          </Typography.Paragraph>
        )}
      </Modal>
    </div>
  );
};

