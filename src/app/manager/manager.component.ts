import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../Service/manager-service/manager-service.service';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import{PhoneData} from 'src/dtos/phonedata.dto'
import{BookData} from 'src/dtos/bookdata.dto'




@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
})
export class ManagerComponent implements OnInit {
 
   
  public bookData!: any;
  closeModal: string | undefined;

  public bookName!: string;
  public author!: string;
  public describe!: string;
  public bookId!: number;

  

  public form!: FormGroup;


  constructor(private managerService: ManagerService,
    private toastService: ToastrService, 
    private modalService: NgbModal ,
    private formsBuilder: FormBuilder,) {}

  ngOnInit(): void {
    this.loadData();
   
  }
  submit(){
    console.log(this.form.value);
   
    Object.keys(this.form.controls) // ['name', 'price_each', 'size', 'image_url']
      .forEach(key => this.form.controls[key].markAsDirty())

    if (this.form.invalid)
      return;

      const { bookName, author, describe } = this.form.value;
    

      const dto: BookData = {       
        bookName: bookName,
        author:author,
        describe: describe,
      } as BookData

      this.managerService.updateBookData(this.bookId,dto).subscribe(
        (res) => {          
          this.toastService.success('Update successfully!');
          this.loadData();
          let closeModal = document.getElementById("closeModel");
          if(closeModal)
         closeModal.click();
          
        },(error) => this.toastService.error('Error updating!!!', error)
      );
      this.form.reset();
   
      
     
  }

 
    // API
  public getOneData(bookId :any): void {
    this.managerService.getOneData(bookId).subscribe((data) =>{
        this.bookName = data.bookName;     
        this.author = data.author;    
        this.bookId = data.id;  
        this.describe = data.describe;  
        this.form = this.formsBuilder.group({
          bookName: [data.bookName,[Validators.required, Validators.maxLength(20)]],
          author: [data.author,[Validators.required, Validators.maxLength(30)]],
          describe: [data.describe,[Validators.required,Validators.maxLength(400)]]
        })
        
    },(error) => this.toastService.error('Error getData!!!', error));
   
  }

  public loadData(): void {
    this.managerService.getBookData().subscribe((data) => {
      this.bookData = data;
     
    });
  }

  public deletePhoneData(phoneData: any): void {
    swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.managerService.deleteBookData(phoneData.id).subscribe(
          (res) => {
           
            this.bookData = this.bookData.splice(phoneData.id, 1);
            this.toastService.success('Delete successfully!', phoneData.name)
            let row_delete = document.getElementById("tr-"+phoneData.id);
         
            this.loadData();
            if(row_delete)
            row_delete.innerHTML="";
  
          },
          (error) => this.toastService.error('Error deleting!!!', error)
        );
      }
    })
 
   
  }
   // Bootstrap Models
   triggerModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
     this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}

