/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import { TextInputProps } from 'react-native';

import { useField } from '@unform/core';
import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
  containerStyle?: styleProps;
}

interface styleProps {
  marginTop?: number;
}

interface inputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = (
  { name, icon, containerStyle = {}, ...rest },
  ref,
) => {
  const { registerField, defaultValue = '', fieldName, error } = useField(name);
  const inputElementRef = useRef<any>(null);
  const inputValueRef = useRef<inputValueReference>({ value: defaultValue });

  const [isFocused, SetIsFocused] = useState(false);
  const [isFilled, SetIsFilled] = useState(false);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  const hunddleInputFocus = useCallback(() => {
    SetIsFocused(true);
  }, []);

  const hundleInputBlur = useCallback(() => {
    SetIsFocused(false);
    SetIsFilled(!!inputValueRef.current?.value);
  }, []);

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container isFocused={isFocused} isErrored={!!error} style={containerStyle}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360'}
      />
      <TextInput
        ref={inputElementRef}
        placeholderTextColor="#666360"
        defaultValue={defaultValue}
        onChangeText={value => {
          inputValueRef.current.value = value;
        }}
        onFocus={hunddleInputFocus}
        onBlur={hundleInputBlur}
        {...rest}
      />
    </Container>
  );
};

export default forwardRef(Input);
