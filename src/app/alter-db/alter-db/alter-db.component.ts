import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-alter-db',
  templateUrl: './alter-db.component.html',
  styleUrls: ['./alter-db.component.css']
})
export class AlterDBComponent {

  constructor(
    public authService: AuthService) { }

  logout() {
    this.authService.logout();
  }

}
