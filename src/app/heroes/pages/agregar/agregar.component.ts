import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap} from 'rxjs/operators'

import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';
import { HeroesService } from '../../services/heroes.service';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';


@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles:[`
    img{
      width: 100%;
      border-radius: 5px;
    }
  `]
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ]

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: '',
  }

  constructor(private heroesService: HeroesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {

    if(!this.router.url.includes('editar')){
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.heroesService.getHeroePorId(id))
      )
      .subscribe( heroe => this.heroe = heroe);

  }

  guardar(){
    if(this.heroe.superhero.trim().length === 0){
      return
    }

    //Actualizar Heroe
    if(this.heroe.id){
      this.heroesService.actualizarHeroe(this.heroe)
        .subscribe( heroe => this.mostrarSnakbar('Registro Actualizado'))
    }else{

      //Agregar Heroe
      this.heroesService.agregarHeroe(this.heroe)
        .subscribe(heroe => {
          this.mostrarSnakbar('Registro Creado');
          this.router.navigate(['/heroes/editar', heroe.id]);
        })

    }

  }

  borrarHeroe(){

    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '250px',
      data: {...this.heroe}
    })

    dialog.afterClosed().subscribe(
      res => {
        if(res){
          this.heroesService.borrarHeroe(this.heroe.id!)
            .subscribe( resp => {
              this.router.navigate(['/heroes'])
            })
        }    
      }
    )



  }

  mostrarSnakbar(mensaje: string){
    this.snackBar.open(mensaje, 'OK!', {
      duration: 3500
    })
  }

}
