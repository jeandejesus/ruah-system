import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { PackagesService } from 'src/app/core/services/packages.service';
import { PackagePlan } from 'src/app/shared/packages.constants';
import { Local, LocaisService } from 'src/app/core/services/locais.service';

@Component({
  selector: 'app-landing-ruah',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './landing-ruah.component.html',
  styleUrls: ['./landing-ruah.component.scss'],
  providers: [PackagesService, LocaisService],
})
export class LandingRuahComponent implements OnInit, AfterViewInit {
  packages: PackagePlan[] = [];
  loadingPackages = true;

  locais: Local[] = [];
  loadingLocais = true;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private packagesService: PackagesService,
    private locaisService: LocaisService,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Ruah | Dança e Profecia - Escola de Dança Católica');

    this.metaService.addTags([
      { name: 'description', content: 'Escola de dança Ruah - Transformando vidas através da dança e profecia. Conheça nossos pacotes e modalidades de Ballet, Jazz Contemporâneo e muito mais em uma perspectiva Católica.' },
      { name: 'keywords', content: 'dança, escola de dança, ruah, dança católica, profecia, ballet, jazz contemporâneo' },
      { name: 'author', content: 'Ruah System' },
      { property: 'og:title', content: 'Ruah | Dança e Profecia' },
      { property: 'og:description', content: 'Transformando vidas através da dança e profecia. Venha dançar conosco!' },
      { property: 'og:image', content: './assets/ruah.PNG' },
      { property: 'og:type', content: 'website' }
    ]);

    this.loadPackages();
    this.loadLocais();
  }

  loadPackages(): void {
    this.packagesService.getAll().subscribe({
      next: (data) => {
        this.packages = data;
        this.loadingPackages = false;
        
        // Inicializa a animação dos cards após eles serem renderizados no DOM
        setTimeout(() => {
          this.observeElements('.package-card.reveal-card');
        }, 50);
      },
      error: () => {
        // Fallback silencioso — landing não deve quebrar
        this.loadingPackages = false;
      },
    });
  }

  loadLocais(): void {
    this.locaisService.getLocais().subscribe({
      next: (data) => {
        this.locais = data;
        this.loadingLocais = false;
        
        setTimeout(() => {
          this.observeElements('.location-card.reveal-card');
        }, 50);
      },
      error: () => {
        this.loadingLocais = false;
      },
    });
  }

  formatPrice(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

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
      this.observeElements(selector);
    });
  }

  private observeElements(selector: string): void {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Para parar de observar após animar
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  scrollToPacotes() {
    const el = document.getElementById('pacotes');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
