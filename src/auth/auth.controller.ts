import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuariosService } from '../modules/usuarios/usuarios.service';
import { CreateUsuarioDto } from '../modules/usuarios/dto/create-usuario.dto';
import { LoginUsuarioDto } from '../modules/usuarios/dto/login-usuario.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o email ya registrado' })
  async register(@Body() createUsuarioDto: CreateUsuarioDto) {
    try {
      const user = await this.usuariosService.create(createUsuarioDto);
      return {
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          rol: user.rol
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al registrar el usuario',
        error: error.response || error
      };
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginUsuarioDto: LoginUsuarioDto) {
    try {
      const { email, password } = loginUsuarioDto;
      const result = await this.usuariosService.login(email, password);
      return {
        success: true,
        ...result
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al iniciar sesión',
        error: error.response || error
      };
    }
  }
} 