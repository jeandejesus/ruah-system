import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alunoFilter',
})
export class AlunoFilterPipe implements PipeTransform {
  transform(alunos: any[], searchText: string): any[] {
    if (!alunos || !searchText) {
      return alunos;
    }

    searchText = searchText.toLowerCase();

    return alunos.filter(
      (aluno) =>
        aluno.name?.toLowerCase().includes(searchText) ||
        aluno.email?.toLowerCase().includes(searchText) ||
        aluno.phone?.toLowerCase().includes(searchText)
    );
  }
}
