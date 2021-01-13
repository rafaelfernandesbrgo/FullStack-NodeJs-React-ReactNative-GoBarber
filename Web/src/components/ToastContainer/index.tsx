import React from 'react';
import { useTransition } from 'react-spring';
import { Container } from './styles';
import { ToastMessage } from '../../hooks/Toast';
import Toast from './Toast';

interface toastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<toastContainerProps> = ({ messages }) => {
  const messageWithTransition = useTransition(messages, message => message.id, {
    from: { right: '-120%', opacity: 0 },
    enter: { right: '0%', opacity: 1 },
    leave: { right: '-120%', opacity: 0 },
  });
  return (
    <Container>
      {messageWithTransition.map(({ item, key, props }) => (
        <Toast key={key} message={item} style={props} />
      ))}
    </Container>
  );
};

export default ToastContainer;
