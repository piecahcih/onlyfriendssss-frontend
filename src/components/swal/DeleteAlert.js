import Swal from 'sweetalert2'

const swalWithBootstrapButtons = Swal.mixin({
  width: '300px',  
  padding: '12px', 
  customClass: {
    icon: 'scale-[0.7] !mx-auto !my-0',
    title: '!-mt-6',
    confirmButton: "btn bg-[#FC5100] text-white",
    cancelButton: "btn btn-danger mr-3",
  },
  buttonsStyling: false
});

export function DeleteSwal ({currentActivity, hdlCancel}) {

    swalWithBootstrapButtons.fire({
      title: `<h2 class="text-[24px] font-bold text-neutral leading-tight">Cancel ${currentActivity.title} ?</h2>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cancel",
      cancelButtonText: "No",
      reverseButtons: true
    }).then(async(result) => {
      if (result.isConfirmed){
        await hdlCancel()
          swalWithBootstrapButtons.fire({
          title: "This Activity has been cancelled.",
          icon: "success"
        });
      } 
    });
}

