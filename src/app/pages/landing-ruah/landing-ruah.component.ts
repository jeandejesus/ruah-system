import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-ruah',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // 👈 OBRIGATÓRIO
  ],
  templateUrl: './landing-ruah.component.html',
  styleUrls: ['./landing-ruah.component.scss'],
})
export class LandingRuahComponent implements AfterViewInit {
  packages = [
    {
      key: 1,
      title: '1 Modalidade',
      price: 'R$ 479,40',
      installment: '6x de R$ 79,90',
      link: 'https://link-pagamento-1',
    },
    {
      key: 2,
      title: '2 Modalidades',
      price: 'R$ 660,00',
      installment: '6x de R$ 110,00',
      highlight: true,
      link: 'https://link-pagamento-2',
    },
    {
      key: 3,
      title: 'CIA',
      subtitle: 'Turma fechada - apenas alunos indicados',
      price: 'R$ 779,40',
      installment: '6x de R$ 129,90',
      link: 'https://link-pagamento-3',
    },
    {
      key: 4,
      title: 'Jazz Contemporâneo',
      subtitle: 'Sábado - Studio Backstage',
      price: 'R$ 599,40',
      installment: '6x de R$ 99,90',
      link: 'https://link-pagamento-4',
    },
  ];

  ngAfterViewInit(): void {
    const video = document.querySelector('.hero-video') as HTMLVideoElement;

    if (video) {
      video.muted = true;
      video.volume = 0;
      video.play().catch(() => {});
    }

    // Seletores de animação
    const selectors = [
      '.reveal-fade-up',
      '.reveal-scale',
      '.reveal-image',
      '.reveal-card',
      '.reveal-parallax'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      elements.forEach((el) => observer.observe(el));
    });
  }

  scrollToPacotes() {
    const el = document.getElementById('pacotes');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
