// src/components/icons.tsx
import {
  // Navegación y UI
  Home, 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  User,
  LogIn, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  
  // Usuario y autenticación
  UserPlus, 
  UserMinus, 
  UserCog,
  Mail, 
  Lock, 
  Key,
  Eye,
  EyeOff,
  
  // Restaurante y comida
  UtensilsCrossed,
  Coffee,
  PizzaIcon,
  Soup,
  Beer,
  Wine,
  Beef,
  Apple,
  Sandwich,
  IceCream,
  
  // Administración
  ShoppingCart,
  CreditCard,
  DollarSign,
  Calendar,
  Clock,
  Bookmark,
  Star,
  Heart,
  Map,
  MapPin,
  
  // Acciones
  Plus,
  Minus,
  Edit,
  Trash,
  Save,
  Check,
  AlertCircle,
  AlertTriangle,
  Info,
  
  // Comunicación
  Send,
  MessageSquare,
  PhoneCall,
  Share2,
  
  // Dispositivos
  Smartphone,
  Tablet,
  Laptop,
  Printer
} from 'lucide-react';

// Exportamos los iconos organizados por categorías para facilitar su uso
export const Icons = {
  // Navegación y UI
  home: Home,
  menu: Menu,
  search: Search,
  bell: Bell,
  settings: Settings,
  user: User,
  login: LogIn,
  logout: LogOut,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  close: X,
  
  // Usuario y autenticación
  register: UserPlus,
  removeUser: UserMinus,
  userSettings: UserCog,
  email: Mail,
  password: Lock,
  key: Key,
  showPassword: Eye,
  hidePassword: EyeOff,
  
  // Restaurante y comida
  restaurant: UtensilsCrossed,
  coffee: Coffee,
  pizza: PizzaIcon,
  soup: Soup,
  beer: Beer,
  wine: Wine,
  meat: Beef,
  fruit: Apple,
  sandwich: Sandwich,
  dessert: IceCream,
  
  // Administración
  cart: ShoppingCart,
  payment: CreditCard,
  price: DollarSign,
  calendar: Calendar,
  time: Clock,
  bookmark: Bookmark,
  favorite: Star,
  like: Heart,
  map: Map,
  location: MapPin,
  
  // Acciones
  add: Plus,
  remove: Minus,
  edit: Edit,
  delete: Trash,
  save: Save,
  confirm: Check,
  warning: AlertCircle,
  alert: AlertTriangle,
  info: Info,
  
  // Comunicación
  send: Send,
  message: MessageSquare,
  call: PhoneCall,
  share: Share2,
  
  // Dispositivos
  mobile: Smartphone,
  tablet: Tablet,
  computer: Laptop,
  print: Printer,
  
  // Logo personalizado (componente SVG)
  logo: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-6 w-6 ${className}`}
      {...props}
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <path d="M4 22v-7" />
      <circle cx="9" cy="9" r="2" />
      <circle cx="15" cy="13" r="2" />
    </svg>
  ),
};