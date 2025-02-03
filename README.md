<div align="center"><img src="./cd2024bfs5g1-frontend/src/main/ngx/src/assets/images/sidenav-closed-verde.png" alt="WorkWander"/></div>

# **WORKWANDER**

# <div id="1">**Índice** 📑</Div>

1. [Descripción](#id1)
2. [Estado](#id2)
3. [Funcionalidades](#id3)
    * [Coworkings](#id4)
        * [Datos de coworking](#id5)
    * [Eventos](#id6)
        * [Datos de evento](#id7)
    * [Mi espacio](#id8)
        * [Mi calendario](#id9)
        * [Mis reservas](#id10)
    * [Gestionar coworkings](#id12)
        * [Nuevo coworking](#id13)
        * [Mis coworkings](#id14)
    * [Gestionar eventos](#id16)
        * [Nuevo evento](#id17)
        * [Mis eventos](#id18)
    * [Análisis](#id20)
        * [Ocupación](#id21)
        * [Facturación](#id22)
        * [Influencia de eventos](#id23)
4. [Despliegue en Cloud](#id24)
5. [Despliegue con Docker](#id25)
6. [Despliegue local](#id26)
7. [Acceso a la aplicación](#id27)
    * [Usuarios predeterminados](#id28)
    * [Cómo lanzar la aplicación](#id29)
8. [Tecnologías usadas](#id30)
    * [Backend](#id31)
    * [Frontend](#id32)<span id="v32"></span>
    * [Bases de datos](#id33)
    * [IDE'S](#id34)
    * [Control de código](#id35)
    * [Pruebas unitarias](#id36)
9. [Autoría](#id37)

---

## <div id="id1">1. Descripción&nbsp;👀</div>

Esta aplicación está construida para permitir que los nómadas digitales puedan encontrar espacios de coworking y eventos
cercanos a los primeros, durante sus desplazamientos en cualquier parte del mundo. Va orientada también a empresas y
profesionales del sector coworking para que desde ella gestionen sus espacios y así ofrecer a los coworkers viajeros un
lugar donde poder trabajar y reunirse.

La plantilla de la aplicación está basada en Ontimize Web y Ontimize Boot (java 11).

Utiliza esta plantilla para generar una aplicación con una estructura estándar y una configuración de Ontimize
predefinida para la autenticación de Ontimize y una base de datos única, utilizando PostgreSQL.

Echa un vistazo a la documentación de application.yml y [Ontimize Boot](https://ontimize.github.io/docs/) para
personalizarla según sea necesario.

Se proporcionan varios archivos de configuración de Spring Boot. Se recomienda utilizar variables de entorno en los
archivos de configuración de Spring para los valores de configuración que dependen del entorno.

Para el entorno K8, se recomienda que el starter de Spring esté configurado en un puerto diferente al de la
aplicación. (ver application-staging.yml)

<span>[🔝](#workwander)</span>
---

## <div id="id2">2. Estado&nbsp;🏁</div>

La aplicación está finalizada, a no ser por alguna implementación que se pueda incorporar a mayores.
Es un proyecto con licencia OpenSource.

<span>[🔝](#workwander)</span>
---

## <div id="id3">3. Funcionalidades&nbsp;🛠</div>

### ***<div id="id4">Coworkings</div>***

Listado de coworkings en forma de grid al que puede acceder cualquier usuario, registrado o no. Se muestra una foto del
coworking, junto con su nombre, precio, etiquetas que indican si el coworking es nuevo y servicios que posee. Este
listado permite efectuar varios filtros: ***Localización mediante mapa***, ***Localidad***, ***Servicios ofrecidos***,
***Fecha de creación*** y ***Precio***

#### ***<div id="id5">Datos de coworkings</div>***

Formulario al que puede acceder cualquier usuario registrado o no. Aquí se muestra desde el nombre del coworking,
descripción, plazas, precio, fotografía, localidad, dirección y mapa de ubicación. Se permite la reserva del coworking a
usuarios registrados siempre y cuando existan plazas libres.
Figuran las reseñas dadas al coworking, en caso de haberlas y un carrusel con los eventos del día y futuros que haya en
la misma localidad del coworking.

### ***<div id="id6">Eventos</div>***

Listado de eventos en forma de grid al que puede acceder cualquier usuario, registrado o no. Se muestra una foto del
evento, junto con su nombre, precio, en caso de que sea gratuito, se muestra una etiqueta. Este listado permite filtrar
por ***Nombre de evento***.

#### ***<div id="id7">Datos de eventos</div>***

Formulario al que puede acceder cualquier usuario registrado o no. Aquí se muestra desde el nombre del evento,
descripción, plazas, precio, fotografía, localidad, dirección y mapa de ubicación. Se permite la reserva del evento a
usuarios registrados siempre y cuando existan plazas libres.

### ***<div id="id8">Mi espacio</div>***

Espacio donde ver información sobre las reservas realizadas tanto de coworkings como de eventos, al que se puede acceder
como usuario.

#### ***<div id="id9">Mi calendario</div>***

Calendario donde ver la reservas realizadas ubicadas temporalmente.

#### ***<div id="id10">Mis reservas</div>***

Listado de reservas realizas en el que se puede ver su estado, cancelarla, hacer una reseña o ver el código QR de
acceso, así como un mapa de su ubicación pinchando sobre el icono.

### ***<div id="id12">Gestionar coworkings</div>***

Espacio al que se accede como empresa y permite crear un nuevo coworking o ver los coworkings que ya has creado.

#### ***<div id="id13">Nuevo coworking</div>***

Permite dar de alta un nuevo coworking introduciendo los siguientes datos:
Nombre, descripción, capacidad, precio, servicios disponibles, imagen y la dirección con ubicación en el mapa y
posibilidad
de ajustar a la ubicación exacta.

#### ***<div id="id14">Mis coworkings</div>***

Listado de coworkings desde donde se pueden editar o eliminar.

### ***<div id="id16">Gestionar eventos</div>***

Permite crear un nuevo evento o ver los eventos que ya has creado. Tienen acceso tanto los usuarios como las empresas.

#### ***<div id="id17">Nuevo evento</div>***

Permite crear un nuevo evento con los siguientes campos:
nombre, descripción, fecha, hora, duración, capacidad, precio, localidad, dirección y fotografía.

#### ***<div id="id18">Mis eventos</div>***

Listado de eventos dentro del espacio personal del usuario o la empresa. Permite gestionar los eventos creados por ese
perfil. Consta de las columnas nombre, dirección, fecha y hora. Si se hace click sobre alguno de ellos, se accede a una
pantalla de detalle en la que se pueden editar los datos de dicho evento.

### ***<div id="id20">Análisis</div>***

Opción dentro del menú del perfil empresa que permite desplegar los tres tipos de análisis de datos disponibles:
ocupación, facturación e influencia de eventos.

#### ***<div id="id21">Ocupación</div>***

Gráfica tipo line-chart que permite relacionar los coworkings con el número de reservas que tienen en un periodo de
tiempo determinado.

#### ***<div id="id22">Facturación</div>***

Gráfica de barras que permite relacionar los coworkings con los ingresos que han generado en un periodo de tiempo
determinado.

#### ***<div id="id23">Influencia de eventos</div>***

Semáforo de actividad aplicado a un calendario en el cual se representa el porcentaje de ocupación de un coworking en
función de los eventos que están programados en su área cercana. La ocupación baja se muestra de color rojo, las
intermedias de tonos anaranjados y las altas de color verde.

<span>[🔝](#workwander)</span>
---

## <div id="id24">4. Despliegue en Cloud&nbsp;🌐</div>

Esta aplicación está preparada para ser desplegada en un Cluster de Kubernetes, usando Helm Charts proporcionados en
./charts folder.

Otros ficheros proporcionados:

		./Dockerfile: Proporcionado tal cual. Adáptalo como necesites.

		./.git/workflows/maven-build-docker-ecr.yaml: Adáptalo como necesites. El setup proporcionado es:

			- Fires on push in develop branch
			- Realiza la verificación de maven
			- Contruye la imagen docker
			- Extracta la versión del proyecto desde pom.xml
			- Actualiza la versión en ./charts/xxx/Chart.yaml
			- Haz un push de la imagen de Docker a Amazon AWS ECR (login, repositorio, etc. están hechos automáticamente. Las credenciales no son necesarias si la organización del repositorio es  imatia-innovation).

		Postdata: Amazon AWS ECR puede ser customizado dependiendo de la infraestructura necesaria y el setup. LA configuración proporcionada es estándar y debería funcionar en muchos casos.

<span>[🔝](#workwander)</span>
---

## <div id="id25">5. Despliegue con Docker Compose&nbsp;🖥</div>

Esta aplicación está preparada para ser desplegada en una máquina local, usando los ficheros docker compose
proporcionados en ./ folder:

		./docker-compose.yaml: Adáptalo como necesites. El setup proporcionado es:

			- Construye la imagen de Docker
			- Ejecuta la base de datos (Definida en docker-compose-services.yaml)
			- Ejecuta la aplicación

		./docker-compose-services.yaml: Adáptalo como necesites. El setup proporcionado es:

			- Ejecuta la base de datos

Los servicios necesarios para ejecutar la aplicación, como la base de datos, se proporcionan en un archivo separado para
permitir ejecutar solo los servicios y poder iniciar la aplicación desde un IDE.

- Ve a la carpeta de la aplicación

  	cd cd2024bfs5g1

- Con privilegios de Docker, ejecuta el siguiente comando para iniciar la implementación:

  	docker compose up

La aplicación se implementa como un contenedor de Docker en la url: [http://localhost:8080](http://localhost:8080)

- Lista los pods:

  	docker ps

- Muestra los logs de cada contenedor:

  	docker logs -f id_container

- Accede a la consola del contenedor:

  	docker exec -it id_container sh

- Para el despliegue:

  	docker compose down
  	docker volume prune

<span>[🔝](#workwander)</span>
---

## <div id="id26">6. Despliegue local&nbsp;🏠</div>

Los parámetros del fichero application-local.yaml deben coincidir con los valores de los servicios de desarrollo, como
la base de datos. De forma predeterminada, los parámetros coinciden con los valores exitentes en los ficheros Docker.

- Ve a la carpeta de la aplicación.

  	cd cd2024bfs5g1

- Si un despliegue de servicios de desarrollo no está disponible, ejecuta el archivo de de Docker Compose proporcionado
  para iniciar los servicios:

  	docker compose -f docker-compose-services.yaml up

- Compila y despliega la aplicación con los siguientes comandos:

  	mvn clean install -Plocal
  	java -jar cd2024bfs5g1-boot/target/cd2024bfs5g1-boot.jar --spring.profiles.active=local

- La aplicación está accesible usando la siguiente url: [http://localhost:8080](http://localhost:8080)

<span>[🔝](#workwander)</span>
---

## <div id="id27">7. Acceso a la aplicación&nbsp;🚀</div>

### ***<div id="id28">Usuarios predeterminados</div>***

De forma predeterminada, la aplicación proporciona tres usuarios. Adáptalo según sea necesario:

- Demo:
    - Rol: `User`
    - Nombre de usuario: `demo`
    - Contraseña: `demouser`

- Company:
    - Rol: `Company`
    - Nombre de usuario: `company`
    - Contraseña: `democompany`

### ***<div id="id29">Cómo lanzar la aplicación</div>***

### Ontimize Boot

- Ve a la carpeta de la aplicación y ejecuta una instalación:

  	mvn clean install -Plocal

#### Inicia solo el servidor:

- Ve a la carpeta `cd2024bfs5g1-boot` y ejecuta el comando:

  	mvn spring-boot:run -Dspring-boot.run.profiles=local

#### Ejecuta el cliente solo, fuera del servidor spring-boot

- Ve a la carpeta `frontend/src/main/ngx`, Si está node y npm instalados en el sistema, ejecuta los siguientes comandos:

  	npm install
  	npm run start-local

Usa la siguiente URL para acceder a la aplicación: [http://localhost:4299](http://localhost:4299)

#### Desplegar y ejecutar cliente y servidor juntos

- Ve a la carpeta `cd2024bfs5g1-boot/target` y ejecuta el comando:

  	java -jar cd2024bfs5g1-boot/target/cd2024bfs5g1-boot.jar --spring.profiles.active=local

Usa la siguiente URL para acceder a la aplicación: [http://localhost:8080](http://localhost:8080)

<span>[🔝](#workwander)</span>
---

## <div id="id30">8. Tecnologías usadas&nbsp;💾</div>

La aplicación ha sido desarrollada usando las tecnologías y dependencias que se describen a continuación.

### <div id="id31">Backend</div>

![jdk-11.0.24.8-hotspot](https://img.shields.io/badge/Java%2011-%23ED8B00.svg?style=flat&logo=java&logoColor=white) [Java 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html):
Lenguaje de programación multiplataforma orientado a objetos que se ejecuta en miles de millones de dispositivos de todo
el mundo, se usa principalmente para desarrollar aplicaciones del lado del backend.

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-%236DB33F.svg?style=flat&logo=springboot&logoColor=white) [Spring Boot](https://spring.io/projects/spring-boot):
Herramienta que acelera y simplifica el desarrollo de microservicios y aplicaciones web.

![JPA (Java Persistence API)](https://img.shields.io/badge/JPA%20(JAVA%20PERSISTENCE%20API)-blue) [JPA (Java Persistence API)](https://jakarta.ee/specifications/persistence/):
Permite la persistencia de los datos, facilitando así el trabajo con la Base de Datos.

![Maven](https://img.shields.io/badge/Maven-%23C71A36.svg?style=flat&logo=apachemaven&logoColor=white) [Maven](https://maven.apache.org/):
Herramienta de comprensión y gestión de proyectos de software. Basado en el concepto de modelo de
objetos de proyecto (**POM**), Maven puede gestionar la construcción, los informes y la documentación de un proyecto
desde una pieza de información central.

![Ontimize](https://img.shields.io/badge/Ontimize-yellow) [Ontimize](https://ontimize.com/):
Tecnología de Spring Boot para simplificar aún más un servidor basado en servicios o
microservicios, usando el sistema de comunicación API REST.

### <div id="id32">Frontend</div>

![Angular](https://img.shields.io/badge/Angular-%23DD0031.svg?style=flat&logo=angular&logoColor=white) [Angular](https://angular.io/):
Framework para el desarrollo del frontend, que permite construir aplicaciones web de una sola página (SPA) con un alto
nivel de interacción.

![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white) [TypeScript](https://www.typescriptlang.org/):
Superset de JavaScript que añade tipado estático, utilizado en la construcción del frontend.

![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white) [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML):
Lenguaje de marcado estándar para la estructura de la interfaz.

![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white) [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS):
Hojas de estilo para el diseño y la presentación.

![SCSS](https://img.shields.io/badge/SCSS-%23CC6699.svg?style=flat&logo=sass&logoColor=white) [SCSS](https://sass-lang.com/):
Preprocesador de CSS que permite escribir hojas de estilo de forma modular y avanzada.

### <div id="id33">Bases de datos</div>

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%23336791.svg?style=flat&logo=postgresql&logoColor=white) [PostgreSQL](https://www.postgresql.org/):
Sistema de gestión de bases de datos relacional utilizado para almacenar la información de los usuarios, tutores, y
otros datos relevantes.

### <div id="id34">IDE's</div>

![VS Code](https://img.shields.io/badge/VS%20Code-%23007ACC.svg?style=flat&logo=visualstudiocode&logoColor=white) [Visual Studio Code](https://code.visualstudio.com/):
Editor de código fuente utilizado para el desarrollo frontend.

![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ%20IDEA-%23000000.svg?style=flat&logo=intellijidea&logoColor=white) [IntelliJ IDEA](https://www.jetbrains.com/idea/):
IDE utilizado para el desarrollo backend en Java.

### <div id="id35">Control de código</div>

![GitHub](https://img.shields.io/badge/GitHub-black?logo=github) [GitHub](https://github.com/): Plataforma online para
almacenamiento y gestión de control de versiones utilizado para gestionar el código fuente del proyecto.

### <div id="id36">Pruebas unitarias</div>

![JUnit](https://img.shields.io/badge/JUnit-%23A020F0.svg?style=flat&logo=java&logoColor=white) [JUnit](https://junit.org/junit5/):
Framework para pruebas unitarias en Java, utilizado para garantizar la calidad del código.

<span>[🔝](#workwander)</span>

## <div id="id37">9. Autoría</div>

🚀 Estudiantes del Bootcamp de Desarrollo Fullstack

| Nombre       | Apellido 1       | Apellido 2       |
|--------------|------------------|------------------|
| Juan         | Fuente           | Torrado          |
| Juan Jesús   | Tenreiro         | Rodriguez        |
| Bryan        | Quintas          | Lareo            |
| Alberto      | Salvado          | Fernández        |
| Hugo         | Rodriguez        | Marcelino        |
| Diego        | Miras            | Curras           |
| Ana          | Martinez         | Puga             |
| Adela        | Santalla         | Ruiz de Cortázar |
| Lucas        | González-Redondo | Rodríguez        |
| Julián       | Ramiro           | Sánchez          |
| David        | Acha             | Olivera          |
| Alejandro    | González         | López            |
| Tania        | Pacio            | Rivas            |
| Orlando José | Garcés           | Casal            |
| Javier       | Noguer           | Fernández        |
| Beatriz      | Faro             | Carrera          |
| Sergio       | Sanmiguel        | Vázquez          |
| Julio        | Díaz             | López            |
| Nataly Laura | Alvarado         | Luján            |
| Diego Alonso | Carcamo          | Gutierrez        |
| Miguel Ángel | Rama             | Martínez         |

<span>[🔝](#workwander)</span>

