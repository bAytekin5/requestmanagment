import { Layout, Menu, Typography } from 'antd';
import { LogoutOutlined, ProfileOutlined, TableOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';
import './AppLayout.css';

const { Sider, Content } = Layout;

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { profile, logout } = useAuth();

  return (
    <Layout className="app-shell">
      <Sider breakpoint="lg" collapsedWidth="0" className="glass-sider">
        <div className="brand">
          <Typography.Title level={4} className="brand-title">
            Req<span>Man</span>
          </Typography.Title>
          <Typography.Text className="brand-sub">Request Management</Typography.Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            { key: '/', icon: <ProfileOutlined />, label: <Link to="/">Panel</Link> },
            { key: '/requests', icon: <TableOutlined />, label: <Link to="/requests">Talepler</Link> },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: <span onClick={logout}>Çıkış Yap ({profile?.fullName?.split(' ')[0]})</span>,
            },
          ]}
        />
      </Sider>
      <Layout className="layout-body">
        <Content>
          <div className="page-container">
            <div className="content-surface">{children}</div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

