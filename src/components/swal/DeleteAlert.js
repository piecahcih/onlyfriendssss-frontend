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

export function DeleteSwal ({currentActivity, hdlDelete}) {

    swalWithBootstrapButtons.fire({
      title: `<h2 class="text-[24px] font-bold text-neutral leading-tight">Delete ${currentActivity.title} ?</h2>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then(async(result) => {
      if (result.isConfirmed){
        await hdlDelete()
          swalWithBootstrapButtons.fire({
          title: "This Activity has been deleted.",
          icon: "success"
        });
      } 
    });
}

