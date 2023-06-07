class Camera{

	constructor(){
		this.fov = 50;
		this.eye = new Vector3([-5,0,-3]);
		this.at = new Vector3([0,0,-1]);
		this.up = new Vector3([0,1,0]);
	}

	moveForward(speed){
		let f = new Vector3();
    	f.set(this.at);
    	f.sub(this.eye);
    	f.normalize();

    	f.mul(speed);

    	this.eye.add(f);
    	this.at.add(f);
	}

	moveBackward(speed){
		let f = new Vector3();
    	f.set(this.at);
    	f.sub(this.eye);
    	f.normalize();

    	f.mul(speed);

    	this.eye.sub(f);
    	this.at.sub(f);
	}

	moveLeft(speed){
		let f = new Vector3();
    	f.set(this.at);
   		f.sub(this.eye);
    	f.normalize();

    	let left = Vector3.cross(this.up, f);
    	left.mul(speed);

    	this.eye.add(left);
    	this.at.add(left);
	}

	moveRight(speed){
		let f = new Vector3();
    	f.set(this.at);
    	f.sub(this.eye);
    	f.normalize();

    	let right = Vector3.cross(this.up, f);
    	right.mul(speed);

    	this.eye.sub(right);
    	this.at.sub(right);
	}

	panLeft(alpha){
		let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
		
		let rotationMatrix = new Matrix4()
        rotationMatrix.setRotate(alpha, this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        f = rotationMatrix.multiplyVector3(f);
        this.at.set(f.add(this.eye));
	}

	panRight(alpha){
		let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
		
		let rotationMatrix = new Matrix4()
        rotationMatrix.setRotate(-alpha, this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        f = rotationMatrix.multiplyVector3(f);
        this.at.set(f.add(this.eye));
	}
}