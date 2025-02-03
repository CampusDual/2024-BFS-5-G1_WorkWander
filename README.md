<div align="center"><img src="./cd2024bfs5g1-frontend/src/main/ngx/src/assets/images/sidenav-closed-verde.png" alt="WorkWander"/></div>

# **WORKWANDER**

# **Índice** 📑

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
         * [Editar reserva](#id11)
   * [Gestionar coworkings](#id12)
     * [Nuevo coworking](#id13)
     * [Mis coworkings](#id14)
       * [Editar coworking](#id15)
   * [Gestionar eventos](#id16)
     * [Nuevo evento](#id17)
     * [Mis eventos](#id18)
       * [Editar evento](#id19)
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

Esta aplicación está construida para permitir que los nómadas digitales puedan encontrar espacios de coworking y eventos cercanos a los primeros, durante sus desplazamientos en cualquier parte del mundo. Va orientada también a empresas y profesionales del sector coworking para que desde ella gestionen sus espacios y así ofrecer a los coworkers viajeros un lugar donde poder trabajar y reunirse. 

La plantilla de la aplicación está basada en Ontimize Web y Ontimize Boot (java 11).

Utiliza esta plantilla para generar una aplicación con una estructura estándar y una configuración de Ontimize predefinida para la autenticación de Ontimize y una base de datos única, utilizando PostgreSQL.

Echa un vistazo a la documentación de application.yml y [Ontimize Boot](https://ontimize.github.io/docs/) para personalizarla según sea necesario.

Se proporcionan varios archivos de configuración de Spring Boot. Se recomienda utilizar variables de entorno en los archivos de configuración de Spring para los valores de configuración que dependen del entorno.

Para el entorno K8, se recomienda que el starter de Spring esté configurado en un puerto diferente al de la aplicación. (ver application-staging.yml)

---

## <div id="id2">2. Estado&nbsp;🏁</div>

La aplicación está finalizada, a no ser por alguna implementación que se pueda incorporar a mayores.
Es un proyecto con licencia OpenSource.

---

## <div id="id3">3. Funcionalidades&nbsp;🛠</div>

### ***<div id="id4">Coworkings</div>***
Listado de coworkings en forma de grid al que puede acceder cualquier usuario, registrado o no. Se muestra una foto del coworking, junto con su nombre, precio, etiquetas que indican si el coworking es nuevo y servicios que posee. Este listado permite efectuar varios filtros: ***Localización mediante mapa***, ***Localidad***, ***Servicios ofrecidos***, ***Fecha de creación*** y ***Precio***

#### ***<div id="id5">Datos de coworkings</div>***
Formulario al que puede acceder cualquier usuario registrado o no. Aquí se muestra desde el nombre del coworking, descripción, plazas, precio, fotografía, localidad, dirección y mapa de ubicación. Se permite la reserva del coworking a usuarios registrados siempre y cuando existan plazas libres.
Figuran las reseñas dadas al coworking, en caso de haberlas y un carrusel con los eventos del día y futuros que haya en la misma localidad del coworking.


### ***<div id="id6">Eventos</div>***
Listado de eventos en forma de grid al que puede acceder cualquier usuario, registrado o no. Se muestra una foto del evento, junto con su nombre, precio, en caso de que sea gratuito, se muestra una etiqueta. Este listado permite filtrar por ***Nombre de evento***.

#### ***<div id="id7">Datos de eventos</div>***
Formulario al que puede acceder cualquier usuario registrado o no. Aquí se muestra desde el nombre del evento, descripción, plazas, precio, fotografía, localidad, dirección y mapa de ubicación. Se permite la reserva del evento a usuarios registrados siempre y cuando existan plazas libres.

### ***<div id="id8">Mi espacio</div>***


#### ***<div id="id9">Mi calendario</div>***


#### ***<div id="id10">Mis reservas</div>***


##### ***<div id="id11">Editar reserva</div>***


### ***<div id="id12">Gestionar coworkings</div>***


#### ***<div id="id13">Nuevo coworking</div>***


#### ***<div id="id14">Mis coworkings</div>***


##### ***<div id="id15">Editar coworking</div>***


### ***<div id="id16">Gestionar eventos</div>***


#### ***<div id="id17">Nuevo evento</div>***


#### ***<div id="id18">Mis eventos</div>***


##### ***<div id="id19">Editar evento</div>***


### ***<div id="id20">Análisis</div>***


#### ***<div id="id21">Ocupación</div>***


#### ***<div id="id22">Facturación</div>***


#### ***<div id="id23">Influencia de eventos</div>***

---

## <div id="id24">4. Despliegue en Cloud&nbsp;🌐</div>

Esta aplicación está preparada para ser desplegada en un Cluster de Kubernetes, usando Helm Charts proporcionados en ./charts folder.

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

---

## <div id="id25">5. Despliegue con Docker Compose&nbsp;🖥</div>

Esta aplicación está preparada para ser desplegada en una máquina local, usando los ficheros docker compose proporcionados en ./ folder:

		./docker-compose.yaml: Adáptalo como necesites. El setup proporcionado es:

			- Construye la imagen de Docker
			- Ejecuta la base de datos (Definida en docker-compose-services.yaml)
			- Ejecuta la aplicación

		./docker-compose-services.yaml: Adáptalo como necesites. El setup proporcionado es:

			- Ejecuta la base de datos

Los servicios necesarios para ejecutar la aplicación, como la base de datos, se proporcionan en un archivo separado para permitir ejecutar solo los servicios y poder iniciar la aplicación desde un IDE.

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

---

## <div id="id26">6. Despliegue local&nbsp;🏠</div>

Los parámetros del fichero application-local.yaml deben coincidir con los valores de los servicios de desarrollo, como la base de datos. De forma predeterminada, los parámetros coinciden con los valores exitentes en los ficheros Docker.

 - Ve a la carpeta de la aplicación.

		cd cd2024bfs5g1

 - Si un despliegue de servicios de desarrollo no está disponible, ejecuta el archivo de de Docker Compose proporcionado para iniciar los servicios:

		docker compose -f docker-compose-services.yaml up

 - Compila y despliega la aplicación con los siguientes comandos:

		mvn clean install -Plocal
		java -jar cd2024bfs5g1-boot/target/cd2024bfs5g1-boot.jar --spring.profiles.active=local

 - La aplicación está accesible usando la siguiente url: [http://localhost:8080](http://localhost:8080)

---

## <div id="id27">7. Acceso a la aplicación&nbsp;🚀</div>

### ***<div id="id28">Usuarios predeterminados</div>***

De forma predeterminada, la aplicación proporciona tres usuarios. Adáptalo según sea necesario:

- Admin:
    - Rol: `Administrator`
    - Nombre de usuario: `admin`
    - Contraseña: `adminuser`

 - Demo:
    - Rol: `User`
    - Nombre de usuario: `demo`
    - Contraseña: `demouser`
  
 - Company:
   - Rol: `Company`
   - Nombre de usuario: `company`
   - `democompany`

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

---

## <div id="id30">8. Tecnologías usadas&nbsp;💾</div>

La aplicación ha sido desarrollada usando las tecnologías y dependencias que se describen a continuación.

### <div id="id31">Backend</div>
![jdk-11.0.24.8-hotspot](https://img.shields.io/badge/Java%20-%20orange?style=for-the-badge&labelColor=orange&color=orange&link=https%3A%2F%2Fwww.oracle.com%2Fjava%2F) Lenguaje de programación multiplataforma orientado a objetos que se ejecuta en miles de millones de dispositivos de todo el mundo, se usa principalmente para desarrollar aplicaciones del lado del backend.

![Spring Boot](https://img.shields.io/badge/Spring%20Boot%20-%20green?style=for-the-badge&logo=springboot&logoColor=green&link=https%3A%2F%2Fspring.io%2Fprojects%2Fspring-boot) Es una herramienta que acelera y simplifica el desarrollo de microservicios y aplicaciones web.

![JPA (Java Persistence API)](https://img.shields.io/badge/JPA%20(Java%20Persistence%20API)-%20%232A2D94?style=for-the-badge&link=https%3A%2F%2Fjakarta.ee%2Fspecifications%2Fpersistence%2F) Permite la persistencia de los datos, facilitando así el trabajo con la Base de Datos.

![Maven](https://img.shields.io/badge/Apache%20Maven%20-%20red?style=for-the-badge&logo=apachemaven&logoColor=white&link=https%3A%2F%2Fmaven.apache.org%2F) Apache Maven es una herramienta de comprensión y gestión de proyectos de software. Basado en el concepto de modelo de objetos de proyecto (**POM**), Maven puede gestionar la construcción, los informes y la documentación de un proyecto desde una pieza de información central.

![Ontimize Boot](https://img.shields.io/badge/Ontimize%20Boot%20-%20%23F2D936?style=for-the-badge&labelColor=black&link=https%3A%2F%2Fontimize.github.io%2Fontimize-boot%2F) Ontimize Boot usa la tecnología de Spring Boot para simplificar aún más un servidor basado en servicios o microservicios, usando el sistema de comunicación API REST.

### <div id="id32">Frontend</div>
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white&link=https://angular.dev/) Angular es una plataforma y un framework para crear aplicaciones de una sola página (SPA) en el lado del cliente usando HTML y TypeScript. <span>[🔝](#v32)</span>
