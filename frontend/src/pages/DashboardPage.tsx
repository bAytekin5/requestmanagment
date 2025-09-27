import { Card, Col, Row, Statistic, Typography, Skeleton } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { fetchSummary } from '../services/api';
import './DashboardPage.css';

export const DashboardPage = () => {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: fetchSummary,
  });

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <Typography.Title level={2} className="dashboard-title">
          Günü yakala, talepleri yönet.
        </Typography.Title>
        <Typography.Paragraph className="dashboard-subtitle">
          Ekip yükünü dengelerken müşteri talebi yönetimini kolaylaştır. Anlık özetler burada.
        </Typography.Paragraph>
      </div>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 8 }} className="dashboard-skeleton" />
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12} lg={8}>
            <Card className="metric-card">
              <Statistic title="Toplam Talep" value={summary?.total ?? 0} suffix="adet" />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card className="metric-card">
              <Statistic title="Açık" value={summary?.open ?? 0} valueStyle={{ color: '#38bdf8' }} suffix="adet" />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card className="metric-card">
              <Statistic title="Devam Eden" value={summary?.inProgress ?? 0} valueStyle={{ color: '#f97316' }} suffix="adet" />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card className="metric-card">
              <Statistic title="Çözülen" value={summary?.resolved ?? 0} valueStyle={{ color: '#22c55e' }} suffix="adet" />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card className="metric-card">
              <Statistic title="Kapanan" value={summary?.closed ?? 0} valueStyle={{ color: '#c084fc' }} suffix="adet" />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card className="metric-card">
              <Statistic title="Son 7 Gün" value={summary?.last7Days ?? 0} valueStyle={{ color: '#facc15' }} suffix="talep" />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

