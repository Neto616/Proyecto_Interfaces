create database if not exists control_gastos_app;

use control_gastos_app;

create table if not exists usuarios (
	id int auto_increment,
	nombre varchar(100) not null,
	apellido varchar(100) not null,
	correo varchar(256) not null,
	contrasena varchar(100) not null,
	fecha_creacion datetime not null,
	
	constraint pk_usuarios primary key (id)
);

create table if not exists gastos (
	id int auto_increment,
	cantidad float not null,
	fecha_alta datetime not null,
	usuario int not null,
	
	constraint pk_gastos primary key (id),
	constraint fk_usuario_gastos foreign key (usuario) references usuarios(id)
);

create table if not exists categorias (
	id int auto_increment,
	titulo varchar(100) not null,
	icono varchar(100) not null,
	fecha_creacion datetime not null,
	
	constraint pk_categorias primary key (id)
);

create table if not exists categoria_personalizada (
	id int auto_increment not null,
	usuario int not null,
	titulo varchar(100) not null,
	icono varchar(100) not null,
	fecha_creacion datetime not null,
	
	constraint pk_categoria_personalizada primary key (id),
	constraint fk_usuario_categoria_pers foreign key (usuario) references usuarios(id)
);

create table if not exists gastos_categorias_r (
	id int auto_increment,
	id_gasto int not null,
	id_categoria int,
	id_categoria_per int,
	
	constraint pk_gastos_categoria_r primary key (id),
	constraint fk_gasto_gc foreign key (id_gasto) references gastos(id),
	constraint fk_categoria_gc foreign key (id_categoria) references categorias(id),
	constraint fk_categoria_per_gc foreign key (id_categoria_per) references categoria_personalizada(id)
);