import toast from 'react-hot-toast';

// Show toast messages on app
const showToastMessage = (text, type = '') => {
  toast.dismiss();

  const options = {
    duration: 3000,
    position: 'bottom-center',
  };

  if (type === 'success') {
    toast.success(text, options);
  } else if (type === 'error') {
    toast.error(text, options);
  } else {
    toast(text, options);
  }
};

export default showToastMessage;
