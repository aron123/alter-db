import { Component, OnInit } from '@angular/core';
import { BandsService } from './bands.service';
import { Band } from 'src/app/core/models/band.model';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

interface SortedBand {
  key: string;
  bands: Band[];
}

@Component({
  selector: 'app-bands',
  templateUrl: './bands.component.html',
  styleUrls: ['./bands.component.css']
})
export class BandsComponent implements OnInit {

  bands: Band[];
  bandsToShow: Band[];
  sortedBands: SortedBand[];

  // TODO: beautify
  private bandSearchSubject = new Subject<string>();
  readonly bandSearchResult$ = this.bandSearchSubject
    .pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query) {
          this.bandsToShow = this.bands;
          return of([]);
        }

        if (query.length < 3) {
          return of([]);
        }

        this.bandsService.searchBands(query).then(res => this.bandsToShow = res);
        return of([]);
      })
    )
    .subscribe();

  constructor(
    public bandsService: BandsService,
    public router: Router) { }

  async ngOnInit() {
    this.bands = await this.bandsService.getAllBands();
    this.bandsToShow = this.bands;
    this.sortedBands = this.sortBands(this.bands);
  }

  get bandPrefixes() {
    if (!this.sortedBands) {
      return [];
    }

    return this.sortedBands.map(element => element.key);
  }

  isStartsWithAlphaNumericChar(char) {
    const code = char.charCodeAt(0);
    return (!(code > 47 && code < 58) && // numeric (0-9)
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123)) && // lower alpha (a-z)
      !(code > 192 && code < 670); // latin extended (e.g. Á, É, Ő)
  }

  sortBands(bands: Band[]): SortedBand[] {
    const nonAlphaNumeric = { key: '.:?*', bands: [] };
    const result: SortedBand[] = [];

    for (const band of bands) {
      if (this.isStartsWithAlphaNumericChar(band.name)) {
        nonAlphaNumeric.bands.push(band);
      } else {
        const samePrefix: SortedBand[] = result.filter(element => element.key === band.name[0]);

        if (samePrefix.length > 0) {
          samePrefix[0].bands.push(band);
        } else {
          result.push({
            key: band.name[0],
            bands: [band]
          });
        }
      }
    }

    result.sort((a, b) => a.key.localeCompare(b.key, 'hu'));

    if (nonAlphaNumeric.bands.length > 0) {
      result.push(nonAlphaNumeric);
    }

    return result;
  }

  listAllBands() {
    this.bandsToShow = this.bands;
  }

  listOnlyBandsWithPrefix(prefix: string) {
    const bandsWithPrefix: SortedBand[] = this.sortedBands.filter(element => element.key === prefix);
    this.bandsToShow = bandsWithPrefix[0].bands;
  }

  searchBands(query: string) {
    this.bandSearchSubject.next(query);
  }

  goToEditForm(id: number) {
    this.router.navigate(['bands', id.toString()]);
  }

}
