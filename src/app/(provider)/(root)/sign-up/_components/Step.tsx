interface Step {
    label: string;
    type: string;
    title: string;
    key: string;
  }
  
  const steps: Step[] = [
    {
      label: '이메일',
      title: '어떤 이메일을 사용하시겠어요?',
      type: 'email',
      key: 'email'
    },
    {
      label: '비밀번호',
      title: '비밀번호는 무엇으로 할까요?',
      type: 'password',
      key: 'password'
    },
    {
      label: '비밀번호 재확인',
      title: '비밀번호를 한번 더 확인할게요',
      type: 'password',
      key: 'confirmPassword'
    },
    {
      label: '이름',
      title: '성함이 어떻게 되시나요?',
      type: 'text',
      key: 'name'
    },
    {
      label: '사용할 별명',
      title: '저희가 어떻게 불러드리면 될까요?',
      type: 'text',
      key: 'nickname'
    }
  ];
  
  export default steps;
  