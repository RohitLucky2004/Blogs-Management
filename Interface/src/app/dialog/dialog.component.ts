import { Component, Inject } from '@angular/core';
import {MatButtonModule} from'@angular/material/button'
import {MatDialogActions,MatDialogContent,MatDialogClose, MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog'
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatButtonModule,MatDialogActions,MatDialogContent,MatDialogClose],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
constructor
(
  @Inject(MAT_DIALOG_DATA) public data:any,private dialogRef:MatDialogRef<DialogComponent>
){}
confirm(){
  this.dialogRef.close(true)
}
cancel(){
  this.dialogRef.close()
}
}
