import { Button, Card, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useRegisterForm } from '../hooks/useAuthForms';

export const RegisterPage = () => {
  const { form, onFinish, loading } = useRegisterForm();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
      <Card title="Yeni Kullanıcı" style={{ width: 400 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="fullName" label="Ad Soyad" rules={[{ required: true }]}> 
            <Input placeholder="Ad Soyad" />
          </Form.Item>
          <Form.Item name="email" label="E-posta" rules={[{ required: true, type: 'email' }]}> 
            <Input placeholder="ornek@reqman.com" />
          </Form.Item>
          <Form.Item name="password" label="Şifre" rules={[{ required: true, min: 8 }]}> 
            <Input.Password placeholder="En az 8 karakter" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Kayıt Ol
            </Button>
          </Form.Item>
        </Form>
        <Typography.Paragraph style={{ textAlign: 'center' }}>
          Zaten hesabınız var mı? <Link to="/login">Giriş yapın</Link>
        </Typography.Paragraph>
      </Card>
    </div>
  );
};

