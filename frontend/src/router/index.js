import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import LoginView from '@/views/auth/LoginView.vue'; 
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue';
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue'; 
import RegisterView from '@/views/auth/RegisterView.vue';
import ConfirmAccountView from '@/views/auth/ConfirmAccountView.vue';
import ClassDetailsView from '@/views/classes/ClassDetailsView.vue';
import MyScheduledClassesView from '@/views/classes/MyScheduledClassesView.vue';
import ScheduleDetailsView from '@/views/schedule/ScheduleDetailsView.vue'; 
import UserProfileView from '@/views/user/UserProfileView.vue';
import AdminView from '@/views/admin/AdminView.vue';
import AdminLoginView from '@/views/admin/AdminLoginView.vue'; 
import UserManagementView from '@/views/admin/UserManagementView.vue'; 
import ClassManagementView from '@/views/admin/ClassManagementView.vue'; 
import ClassCategoriesManagementView from '@/views/admin/ClassCategoriesManagementView.vue'; 
import CatalogView from '@/views/classes/CatalogView.vue'; 
import SchedulingManagementView from '@/views/admin/SchedulingManagementView.vue'; 

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordView,
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: ResetPasswordView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/confirm-account/:token',
    name: 'ConfirmAccount',
    component: ConfirmAccountView,
  },
  {
    path: '/class-details/:id',
    name: 'ClassDetails',
    component: ClassDetailsView,
    props: true
  },
  {
    path: '/my-scheduled-classes',
    name: 'MyScheduledClasses',
    component: MyScheduledClassesView,
    meta: { requiresAuth: true } // Exige autenticação
  },
  {
    path: '/schedule-details/:id',
    name: 'ScheduleDetails',
    component: ScheduleDetailsView,
    meta: { requiresAuth: true } // Exige autenticação
  },
  {
    path: '/user-profile',
    name: 'UserProfile',
    component: UserProfileView,
    meta: { requiresAuth: true } // Exige autenticação
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true }, // Verificação de admin
  },
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: AdminLoginView, 
  },
  {
    path: '/admin/users-management',
    name: 'Users',
    component: UserManagementView,
    meta: { requiresAuth: true, requiresAdmin: true } 
  },
  {
    path: '/admin/class-management',
    name: 'Classes',
    component: ClassManagementView, 
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/categories-management',
    name: 'ClassCategoriesManagementView',
    component: ClassCategoriesManagementView, 
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/scheduling-management',
    name: 'SchedulingManagementView',
    component: SchedulingManagementView, 
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/catalog/',
    name: 'Catalog',
    component: CatalogView,
    props: true
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Verificação de autenticação global antes de cada navegação
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');  // Obtém o token JWT do usuário
 

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      // Verificar se a rota é de admin, redireciona para o login correto
      if (to.matched.some(record => record.meta.requiresAdmin)) {
        return next({ path: '/admin-login', query: { redirect: to.fullPath } });
      } else {
        // Redirecionar para o login normal se não for uma rota de admin
        return next({ path: '/login', query: { redirect: to.fullPath } });
      }
    }

    const perfilCode = sessionStorage.getItem('perfilCode');  // Obtém o código do perfil
    
    // Verificação de perfil para as rotas de administrador
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (perfilCode !== '001') {
        // Se o usuário não for admin, redireciona para a home
        return next({ path: '/' });
      }
    }
  }

  next(); // Continua a navegação normalmente se não houver restrições
});


export default router;
