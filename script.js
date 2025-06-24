/**
 * =============================================
 * 🚀 APLICACIÓN PRINCIPAL
 * =============================================
 * Archivo JavaScript organizado con módulos separados
 * para efectos visuales, navegación y interacciones
 */

// =============================================
// 🎨 MÓDULO: EFECTOS VISUALES
// =============================================

/**
 * Canvas interactivo con efectos de rayos eléctricos
 * que siguen el movimiento del mouse
 */
class LightningCanvas {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.lastX = null;
    this.lastY = null;
    
    this.init();
  }

  init() {
    this.createCanvas();
    this.resizeCanvas();
    this.setupEventListeners();
  }

  createCanvas() {
    document.body.appendChild(this.canvas);
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setupEventListeners() {
    window.addEventListener("resize", () => this.resizeCanvas());
    document.addEventListener("mousemove", (e) => this.handleMouseMove(e));
  }

  handleMouseMove(e) {
    const { clientX: x, clientY: y } = e;

    if (this.lastX !== null && this.lastY !== null) {
      this.drawRay(this.lastX, this.lastY, x, y);
    }

    this.lastX = x;
    this.lastY = y;
  }

  drawRay(x1, y1, x2, y2) {
    this.setupRayStyle();
    
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);

    const { midX, midY } = this.calculateMidPoint(x1, y1, x2, y2);
    this.ctx.quadraticCurveTo(midX, midY, x2, y2);
    this.ctx.stroke();

    this.drawBranches(midX, midY);
    this.fadeOut();
  }

  setupRayStyle() {
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    this.ctx.lineWidth = 2;
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = "white";
  }

  calculateMidPoint(x1, y1, x2, y2) {
    return {
      midX: (x1 + x2) / 2 + (Math.random() - 0.5) * 30,
      midY: (y1 + y2) / 2 + (Math.random() - 0.5) * 30
    };
  }

  drawBranches(midX, midY) {
    const branchCount = 2;
    const branchRange = 40;

    for (let i = 0; i < branchCount; i++) {
      const branchX = midX + (Math.random() - 0.5) * branchRange;
      const branchY = midY + (Math.random() - 0.5) * branchRange;
      
      this.ctx.beginPath();
      this.ctx.moveTo(midX, midY);
      this.ctx.lineTo(branchX, branchY);
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
  }

  fadeOut() {
    setTimeout(() => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }, 60);
  }
}

/**
 * Maneja efectos de UI como overlays y animaciones de títulos
 */
class UIEffects {
  static initOverlayEffect() {
    const overlay = document.querySelector(".overlay");
    const contenido = document.querySelector(".intro-content");
    
    if (!overlay || !contenido) return;

    this.fadeOutOverlay(overlay, contenido);
  }

  static fadeOutOverlay(overlay, contenido) {
    overlay.style.display = "flex";
    overlay.classList.add("fade-out");
    contenido.classList.add("slide-out");

    setTimeout(() => {
      overlay.style.display = "none";
      overlay.classList.remove("fade-out");
      contenido.classList.remove("slide-out");
    }, 300);
  }

  static initAnimatedTitle() {
    setTimeout(() => {
      const animatedTitle = document.querySelector('.animated-title');
      if (animatedTitle) {
        animatedTitle.classList.add('show');
      }
    }, 300);
  }
}

// =============================================
// 🧭 MÓDULO: NAVEGACIÓN Y SCROLL
// =============================================

/**
 * Maneja el comportamiento dinámico de la barra de navegación
 */
class Navbar {
  static init() {
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  static handleScroll() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    const scrollThreshold = 50;
    const isScrolled = window.scrollY > scrollThreshold;

    navbar.classList.toggle("scrolled", isScrolled);
  }
}

/**
 * Maneja la navegación con subrayado animado
 */
class AnimatedNavigation {
  constructor() {
    this.navItems = document.querySelectorAll(".nav-item");
    this.underline = document.querySelector(".underline");
    this.init();
  }

  init() {
    if (!this.underline || this.navItems.length === 0) return;
    
    this.initializeActiveItem();
    this.setupEventListeners();
  }

  initializeActiveItem() {
    const activeItem = document.querySelector(".nav-item.active");
    if (activeItem) {
      this.moveUnderline(activeItem);
    }
  }

  setupEventListeners() {
    this.navItems.forEach(item => {
      item.addEventListener("click", () => {
        this.handleNavClick(item);
      });
    });
  }

  handleNavClick(clickedItem) {
    this.navItems.forEach(item => item.classList.remove("active"));
    clickedItem.classList.add("active");
    this.moveUnderline(clickedItem);
  }

  moveUnderline(element) {
    this.underline.style.width = `${element.offsetWidth}px`;
    this.underline.style.left = `${element.offsetLeft}px`;
  }
}

/**
 * Controla el comportamiento del scroll de la página
 */
class ScrollController {
  static init() {
    this.forceScrollToTop();
    this.setupEventListeners();
  }

  static forceScrollToTop() {
    if (window.history.replaceState) {
      window.history.replaceState(null, null, window.location.href);
    }
    
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  static setupEventListeners() {
    window.addEventListener('beforeunload', () => {
      window.scrollTo(0, 0);
    });
  }
}

// =============================================
// 🔧 MÓDULO: COMPONENTES INTERACTIVOS
// =============================================

/**
 * Modal para mostrar detalles de jugadores
 */
class PlayerModal {
  constructor() {
    this.modal = document.getElementById('modal-jugador');
    this.modalContent = document.querySelector('.modal-content-jugador');
    this.init();
  }

  init() {
    if (!this.modal) return;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.preventContentClose();
    this.setupOutsideClick();
    this.setupEscapeKey();
  }

  preventContentClose() {
    if (this.modalContent) {
      this.modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  setupOutsideClick() {
    this.modal.addEventListener('click', () => {
      this.close();
    });
  }

  setupEscapeKey() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  open(elemento) {
    const playerData = this.extractPlayerData(elemento);
    this.populateModal(playerData);
    this.modal.style.display = 'flex';
  }

  close() {
    this.modal.style.display = 'none';
  }

  extractPlayerData(elemento) {
    const dataAttributes = [
      'nombre', 'posicion', 'edad', 'estatura', 
      'posiciones', 'grado', 'graduacion'
    ];

    return dataAttributes.reduce((data, attr) => {
      data[attr] = elemento.getAttribute(`data-${attr}`);
      return data;
    }, {});
  }

  populateModal(data) {
    const fields = [
      'nombre', 'posicion', 'edad', 'grado', 
      'graduacion', 'estatura', 'posiciones'
    ];

    fields.forEach(field => {
      const element = document.getElementById(`modal-${field}`);
      if (element && data[field]) {
        element.textContent = data[field];
      }
    });
  }
}

/**
 * Menú lateral responsive para dispositivos móviles
 * Solo se abre/cierra con el botón toggle
 */
class ResponsiveMenu {
  constructor() {
    this.openBtn = document.getElementById('abrirMenu');
    this.sidebar = document.getElementById('menuOverlay');
    this.links = this.sidebar ? this.sidebar.querySelectorAll('a') : [];
    this.isOpen = false;
    this.init();
  }

  init() {
    if (!this.openBtn || !this.sidebar) return;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.setupToggleButton();
    this.setupLinkClicks();
  }

  setupToggleButton() {
    this.openBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita que el evento se propague
      this.toggle();
    });
  }

  setupLinkClicks() {
    this.links.forEach(link => {
      link.addEventListener('click', () => {
        this.close();
      });
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.sidebar.classList.add('open');
    this.isOpen = true;
  }

  close() {
    this.sidebar.classList.remove('open');
    this.isOpen = false;
  }
}

// Inicializar el menú cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  new ResponsiveMenu();
});

// =============================================
// 🚀 MÓDULO: APLICACIÓN PRINCIPAL
// =============================================

/**
 * Clase principal que inicializa y coordina todos los módulos
 */
class App {
  constructor() {
    this.components = {
      lightningCanvas: null,
      playerModal: null,
      responsiveMenu: null,
      animatedNavigation: null
    };
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.initializeComponents();
    this.initializeStaticEffects();
    this.exposeGlobalFunctions();
  }

  initializeComponents() {
    this.components.lightningCanvas = new LightningCanvas();
    this.components.playerModal = new PlayerModal();
    this.components.responsiveMenu = new ResponsiveMenu();
    this.components.animatedNavigation = new AnimatedNavigation();
  }

  initializeStaticEffects() {
    UIEffects.initOverlayEffect();
    UIEffects.initAnimatedTitle();
    Navbar.init();
    ScrollController.init();
  }

  exposeGlobalFunctions() {
    // Funciones accesibles desde HTML
    window.abrirDetalle = (elemento) => {
      this.components.playerModal?.open(elemento);
    };

    window.cerrarDetalle = () => {
      this.components.playerModal?.close();
    };
  }
}

// =============================================
// 🎯 INICIALIZACIÓN
// =============================================

// Punto de entrada de la aplicación
const app = new App();
app.init();