import Swal from 'sweetalert2';

const FriendAlert = Swal.mixin({
  width: '300px',  
  padding: '12px', 
  customClass: {
    icon: 'scale-[0.7] !mx-auto !my-0',
    title: '!-mt-6 font-bold text-neutral leading-tight',
    confirmButton: "btn bg-[#FC5100] text-white",
    cancelButton: "btn btn-danger mr-3",
  },
  buttonsStyling: false
});

export default FriendAlert;
