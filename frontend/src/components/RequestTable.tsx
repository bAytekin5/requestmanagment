import { Button, Space, Table, Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { RequestItem } from '../types';

interface Props {
  data: RequestItem[];
  loading?: boolean;
  onUpdateStatus?: (request: RequestItem) => void;
  onViewDetails?: (request: RequestItem) => void;
}

const statusColors: Record<RequestItem['status'], string> = {
  OPEN: 'blue',
  IN_PROGRESS: 'orange',
  RESOLVED: 'green',
  CLOSED: 'default',
};

const priorityColors: Record<RequestItem['priority'], string> = {
  LOW: 'default',
  MEDIUM: 'processing',
  HIGH: 'warning',
  CRITICAL: 'error',
};

export const RequestTable = ({ data, loading, onUpdateStatus, onViewDetails }: Props) => {
  const columns: ColumnsType<RequestItem> = [
    { title: 'Başlık', dataIndex: 'title', key: 'title' },
    {
      title: 'Açıklama',
      key: 'description',
      render: (_, record) => (
        <Typography.Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'Daha fazla' }} style={{ marginBottom: 0 }}>
          {record.description}
        </Typography.Paragraph>
      ),
    },
    {
      title: 'Çözüm Notu',
      key: 'resolutionNote',
      render: (_, record) => record.resolutionNote ? record.resolutionNote : '-',
    },
    { title: 'İstek Sahibi', dataIndex: 'requesterName', key: 'requesterName', sorter: (a, b) => (a.requesterName || '').localeCompare(b.requesterName || '') },
    {
      title: 'Durum',
      key: 'status',
      render: (_, record) => <Tag color={statusColors[record.status]}>{record.status}</Tag>,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Öncelik',
      key: 'priority',
      render: (_, record) => <Tag color={priorityColors[record.priority]}>{record.priority}</Tag>,
      sorter: (a, b) => a.priority.localeCompare(b.priority),
    },
    { title: 'Kategori', dataIndex: 'category', key: 'category', sorter: (a, b) => (a.category || '').localeCompare(b.category || '') },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {onViewDetails && (
            <Button onClick={() => onViewDetails(record)}>Detay</Button>
          )}
          {onUpdateStatus && (
            <Button type="link" onClick={() => onUpdateStatus(record)}>
              Durum Güncelle
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table<RequestItem>
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

