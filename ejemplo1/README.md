# Conferencia AWS: EC2 y S3
### 28 de marzo de 2025
____

- [**CREAR USUARIO IAM**](#crear-usuario-iam)
- [**CODIGO**](#codigo)

___
## **Crear Usuario IAM**
Para poder acceder a nuestro bucket de AWS, necesitamos crear un usuario IAM que tenga permisos para acceder al bucket.

Inicio de la consola
<p align="center">
  <img src="img/paso1.png" alt="Imagen">
</p>

Buscamos IAM e ingresamos. En el panel izquierdo seleccionamos `Personas`
<p align="center">
  <img src="img/paso2.png" alt="Imagen">
</p>

En en panel de personas o usuarios damos click al botón de la parte izquierda `Crear persona`
<p align="center">
  <img src="img/paso3.png" alt="Imagen">
</p>

Le damos un nombre a nuestro usuario y damos siguiente
<p align="center">
  <img src="img/paso4.png" alt="Imagen">
</p>

Luego seleccionamos la opción de **Adjuntar políticas directamente** y en el buscador seleccionamos el permiso `AmazonS3FullAccess`. Esto nos permitirá cargar y leer imagenes de nuestro bucket. Luego damos siguiente
<p align="center">
  <img src="img/paso5.png" alt="Imagen">
</p>

Nos dará un resumen junto con los permisos asignados y damos `Crear persona`
<p align="center">
  <img src="img/paso6.png" alt="Imagen">
</p>

Estaremos en el panel de usuarios, pero aún necesitamos hacer unos pasos más para eso seleccionamos al usuario
<p align="center">
  <img src="img/paso7.png" alt="Imagen">
</p>

Dentro del usuario en la parte izquierda observamos de **Resumen** observamos que dice **Clave de acceso 1** y seleccionamos la opción marcada en azul `Crear clave de acceso` 
<p align="center">
  <img src="img/paso8.png" alt="Imagen">
</p>

Seleccionamos la opción `otros` y damos siguiente
<p align="center">
  <img src="img/paso9.png" alt="Imagen">
</p>

Añadimos una descripción y damos en `Crear clase de acceso`
<p align="center">
  <img src="img/paso10.png" alt="Imagen">
</p>

____
Por último nos mostrará las claves que utilizaremos en nuestro código, puedes descargar el `.CSV` o copiar y guardar las claves. Una vez hecho lo anterior damos en `Listo`
<p align="center">
  <img src="img/paso11.png" alt="Imagen">
</p>

____
## **Codigo**
Para el ejemplo utilizado en la conferencia, al crear las imagenes de nuestro reportes de disco, árboles, MBR, etc.:


```go
func reportes_tree(commandArray []string) {
	fmt.Println("reporte del arbol")
	disk := "digraph G{\n"
	.
    .
    .
	disk += "}\n"

	err := ioutil.WriteFile("tree.dot", []byte(disk), 0644)
	if err != nil {
		fmt.Println("Error al escribir archivo:", err)
		return
	}
	comprobar_carpeta(ruta)
	cmd := exec.Command("dot", "-Tpng", "-o", "tree.png", "tree.dot")
	err = cmd.Run()
	if err != nil {
		fmt.Println("Error al generar imagen:", err)
		return
	}

	// Subir la imagen a S3
    // Subir la imagen a S3
    // Subir la imagen a S3
	err = subirS3(ruta)
	if err != nil {
		fmt.Println("Error al subir la imagen a S3:", err)
		return
	}
	fmt.Println("Imagen subida correctamente a S3.")
}
```

Luego de generar la imagen podemos utilizar la siguiente función:

```go
func subirS3(filepath string) error {
	
	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String("us-east-1"), 
		Credentials: credentials.NewStaticCredentials(
			"AKIATHU6UZGWPHJOHGVM", // clave de acceso
			"hJp8YU7WrCr3E0XEU97V2eC+Lz6erJEmLfAhbUpo", // clave de acceso de secreta
			"",
		),
	})
	if err != nil {
		return fmt.Errorf("Error al crear sesión AWS: %v", err)
	}

	s3svc := s3.New(sess)

	file, err := os.Open(filepath)
	if err != nil {
		return fmt.Errorf("Error al abrir el archivo de la imagen: %v", err)
	}
	defer file.Close()

	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		return fmt.Errorf("Error al leer el archivo de la imagen: %v", err)
	}

	bucket := "bucket-conferencia-ejemplo" //nombre del bucket
	key := filepath    // nombre del archivo a guardar en el S3
	fmt.Println(filepath)

	_, err = s3svc.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
		Body:   bytes.NewReader(fileBytes),
		ACL:    aws.String("public-read"), // asignar permiso público
	})
	if err != nil {
		return fmt.Errorf("Error al subir archivo a S3: %v", err)
	}

	return nil
}
```
>Nota: Para las claves de acceso y nombre del bucket lo idieal es usar un `.env`.

```go
import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/aws/credentials"
)
```

Ahora en el fronted para la lectura de las imagenes se realizó de la siguiente manera:
```js
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Report.css';

function Report() {
  const navigate = useNavigate();
  const [images] = useState([
    "https://bucket-conferencia-ejemplo.s3.us-east-1.amazonaws.com/disk.png",
    "https://bucket-conferencia-ejemplo.s3.us-east-1.amazonaws.com/tree.png"
  ]);
  // Formato:
  // https://nombre-del-bucket.s3.region-utilizada.amazonaws.com/nombre-del-archivo.png


  return (
    <div className="container">
      <div className="header">
        <button className="btn" onClick={() => navigate('/')}>Consola</button>
        <button className="btn" onClick={() => navigate('/reportes')}>Reportes</button>
      </div>
      <div className="content">
        <h2>Reportes</h2>
        <div className="image-gallery">
          {images.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Imagen ${index + 1}`} className="image-item" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Report;

```
>Nota: para proyectos grandes lo recomendable es utilizar un endpoint para la lectura de la imagenes del bucket u obtenerlos de una base de datos. Para este proyecto al ser pequeño no es necesario ya que se guardan con el mismo nombre cada reporte y su dirrección no cambiará a menos que que se cree otro bucket.

