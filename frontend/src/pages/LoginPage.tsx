import { Button, Card, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useLoginForm } from '../hooks/useAuthForms';

export const LoginPage = () => {
  const { form, onFinish, loading } = useLoginForm();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
      <Card title="ReqMan Giriş" style={{ width: 400 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="E-posta" rules={[{ required: true, type: 'email' }]}> 
            <Input placeholder="ornek@reqman.com" />
          </Form.Item>
          <Form.Item name="password" label="Şifre" rules={[{ required: true }]}> 
            <Input.Password placeholder="Şifreniz" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
        <Typography.Paragraph style={{ textAlign: 'center' }}>
          Hesabınız yok mu? <Link to="/register">Kayıt olun</Link>
        </Typography.Paragraph>
      </Card>
    </div>
  );
};

