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

  faqItems = [
    {
      question: 'Nunca dancei, posso começar na Ruah?',
      answer: 'Com certeza! Temos turmas específicas para iniciantes onde focamos na base técnica e no acolhimento do aluno. Não é necessária experiência prévia.',
      isOpen: false
    },
    {
      question: 'Preciso de um par para as aulas?',
      answer: 'Não. Nossas aulas de Jazz Contemporâneo e Danças Urbanas são focadas no desenvolvimento individual e em grupo, sem necessidade de par.',
      isOpen: false
    },
    {
      question: 'Como funciona a aula experimental?',
      answer: 'Oferecemos uma aula experimental gratuita para que você conheça nossa metodologia, os professores e o ambiente da escola antes de se matricular.',
      isOpen: false
    },
    {
      question: 'Quais os locais das aulas em Curitiba?',
      answer: 'Atualmente temos unidades em paróquias estratégicas de Curitiba e studio parceiro. Verifique a seção de unidades para o endereço mais próximo de você.',
      isOpen: false
    }
  ];

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private packagesService: PackagesService,
    private locaisService: LocaisService,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Ruah | Dança e Profecia - Escola de Dança Católica');

    this.metaService.addTags([
      { name: 'description', content: 'Escola de dança Ruah em Curitiba - Transformando vidas através da dança e profecia. Jazz Contemporâneo, Danças Urbanas e formação católica no bairro e proximidades.' },
      { name: 'keywords', content: 'dança curitiba, escola de dança curitiba, ruah, dança católica curitiba, jazz contemporâneo curitiba, danças urbanas curitiba' },
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

  toggleFaq(index: number): void {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }
}
