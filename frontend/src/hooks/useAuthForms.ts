import { Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login as loginRequest, register as registerRequest } from '../services/api';
import { LoginRequest, RegisterRequest } from '../types';
import { useAuth } from '../auth/AuthContext';

export const useLoginForm = () => {
  const [form] = Form.useForm<LoginRequest>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      login(data);
      message.success('Giriş başarılı');
      navigate('/');
    },
  });

  const onFinish = (values: LoginRequest) => mutation.mutate(values);

  return { form, onFinish, loading: mutation.isPending };
};

export const useRegisterForm = () => {
  const [form] = Form.useForm<RegisterRequest>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (data) => {
      login(data);
      message.success('Kayıt başarılı, yönlendiriliyorsunuz');
      navigate('/');
    },
  });

  const onFinish = (values: RegisterRequest) => mutation.mutate(values);

  return { form, onFinish, loading: mutation.isPending };
};

