import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { OTranslateService } from "ontimize-web-ngx";
@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent {
  featuredSpaces = [
    {
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
      title: "CO|WORKING",
      location: "Lucillos",
      price: "18,00",
      rating: 4,
      amenities: ["wifi", "coffee", "monitor"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80",
      title: "Coworking Marcelino",
      location: "Vigo",
      price: "9,99",
      rating: 3.3,
      amenities: ["wifi", "coffee", "monitor"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80",
      title: "CoTecMe",
      location: "Outeiro de Rei",
      price: "20,00",
      rating: 4.3,
      amenities: ["wifi", "monitor"],
    },
  ];

  features = [
    {
      icon: "🏢", // Edificio para espacios de calidad
      title: this.translate.get("L_FEATURES_TITLE_1"),
      description:
        this.translate.get("L_FEATURES_CONTENT_1"),
    },
    {
      icon: "🤝", // Apretón de manos para networking
      title: this.translate.get("L_FEATURES_TITLE_2"),
      description:
        this.translate.get("L_FEATURES_CONTENT_2"),
    },
    {
      icon: "📈", // Gráfico ascendente para métricas
      title: this.translate.get("L_FEATURES_TITLE_3"),
      description:
        this.translate.get("L_FEATURES_CONTENT_3"),
    },
  ];
  testimonials = [
    {
      name: "Ana I. Ibáñez Manzano",
      rating: 5,
      feedback: "Muchos espacios de calidad en Madrid. Todo perfecto.",
    },
    {
      name: "Borja R.",
      rating: 4,
      feedback: "Totalmente recomendable, siempre limpio y con buena atención.",
    },
    {
      name: "Gabriela Vidal",
      rating: 5,
      feedback: "Super profesionales, el mejor coworking que he probado.",
    },
  ];



  events = [
    {
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80",
      title: "Networking Coffee & Code",
      location: "Madrid Tech Hub",
      date: "25/02/2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80",
      title: "Workshop: Emprendimiento Digital",
      location: "Barcelona Innovation Center",
      date: "25/02/2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
      title: "Startup Weekend",
      location: "Valencia Coworking Space",
      date: "25/02/2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Tech Meetup",
      location: "Sevilla Digital Hub",
      date: "25/02/2025",
    },
    {
      image: "https://images.unsplash.com/photo-1553390774-b4822481c894?q=80&w=1944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Conferencia de Desarrollo Web",
      location: "Online 🌎",
      date: "09/03/2025",
    },
    {
      image: "https://images.unsplash.com/photo-1555077292-22a4489e5897?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Taller de Marketing Digital",
      location: "Online 🌎",
      date: "09/02/2025",
    },
    {
      image: "https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Taller de IA",
      location: "Online 🌎",
      date: "09/02/2025",
    },
    {
      image: "https://plus.unsplash.com/premium_photo-1677269465314-d5d2247a0b0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aWF8ZW58MHx8MHx8fDA%3D",
      title: "Obradoiro de Marketing Digital",
      location: "Presencial 🌎",
      date: "09/02/2025",
    },
    {
      image: "https://plus.unsplash.com/premium_photo-1661963183692-e9a7afee10e0?q=80&w=2673&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Paintball on time",
      location: "Presencial 🌎",
      date: "09/02/2025",
    },
    {
      image: "https://images.unsplash.com/photo-1601830976337-e32f60eba315?q=80&w=2488&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "The witch blair project",
      location: "Presencial 🌎",
      date: "09/02/2025",
    },
    {
      image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Movie session",
      location: "Presencial 🌎",
      date: "19/02/2025",
    },
    {
      image: "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Gaming session",
      location: "Online 🌎",
      date: "10/02/2025",
    }
  ];

  responsiveOptions = [
    {
      breakpoint: "1024px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "768px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "560px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  constructor(
    private router: Router,
    private translate: OTranslateService
  ) { }

  entradaSinLogin() {
    this.router.navigate([" "]);
  }
  registerUser() {
    this.router.navigate(["register/user/new"]);
  }

  goToLogin() {
    this.router.navigate(["/login"]);
  }
}
