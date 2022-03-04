import {
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshPhongMaterial,
  OrthographicCamera,
  Plane,
  PlaneBufferGeometry,
  PlaneGeometry,
  ShaderMaterial,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";

import { HorizontalBlurShader } from "../../lib/HorizontalBlurShader.js";
import { VerticalBlurShader } from "../../lib/VerticalBlurShader.js";

class Shadow {
  private static _instance: Shadow;

  public horizontalBlurMaterial!: ShaderMaterial;
  public verticalBlurMaterial!: ShaderMaterial;
  public renderTarget!: WebGLRenderTarget;
  public renderTargetBlur!: WebGLRenderTarget;
  public shadowCamera!: OrthographicCamera;
  public plane!: Mesh;
  public shadowGroup!: Group;
  public blurPlane!: Mesh;
  public fillPlane!: Mesh;
  public depthMaterial!: MeshDepthMaterial;

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }

  init() {
    Shadow._instance.renderTarget = new WebGLRenderTarget(512, 512);
    Shadow._instance.renderTarget.texture.generateMipmaps = false;

    Shadow._instance.renderTargetBlur = new WebGLRenderTarget(512, 512);
    Shadow._instance.renderTargetBlur.texture.generateMipmaps = false;

    const PLANE_WIDTH = 50;
    const PLANE_HEIGHT = 50;
    const CAMERA_HEIGHT = 4;

    const planeGeometry = new PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT).rotateX(
      Math.PI / 2
    );
    const planeMaterial = new MeshBasicMaterial({
      map: Shadow._instance.renderTarget.texture,
      opacity: 0.7,
      transparent: true,
      depthWrite: false,
    });

    Shadow._instance.shadowGroup = new Group();
    Shadow._instance.shadowGroup.position.y = -0.3;

    Shadow._instance.plane = new Mesh(planeGeometry, planeMaterial);
    // make sure it's rendered after the fillPlane
    Shadow._instance.plane.renderOrder = 1;
    Shadow._instance.shadowGroup.add(Shadow._instance.plane);

    Shadow._instance.plane.scale.y = -0.25;

    // the plane onto which to blur the texture
    Shadow._instance.blurPlane = new Mesh(planeGeometry);
    Shadow._instance.blurPlane.visible = false;
    Shadow._instance.shadowGroup.add(Shadow._instance.blurPlane);

    // the plane with the color of the ground
    const fillPlaneMaterial = new MeshBasicMaterial({
      color: "#ffffff",
      opacity: 0,
      transparent: true,
      depthWrite: false,
    });

    Shadow._instance.fillPlane = new Mesh(planeGeometry, fillPlaneMaterial);
    Shadow._instance.fillPlane.rotateX(Math.PI);
    Shadow._instance.shadowGroup.add(Shadow._instance.fillPlane);

    // the camera to render the depth material from
    Shadow._instance.shadowCamera = new OrthographicCamera(
      -PLANE_WIDTH / 2,
      PLANE_WIDTH / 2,
      PLANE_HEIGHT / 2,
      -PLANE_HEIGHT / 2,
      0,
      CAMERA_HEIGHT
    );
    Shadow._instance.shadowCamera.rotation.x = Math.PI / 2; // get the camera to look up

    Shadow._instance.shadowGroup.add(Shadow._instance.shadowCamera);

    // like MeshDepthMaterial, but goes from black to transparent
    Shadow._instance.depthMaterial = new MeshDepthMaterial();
    Shadow._instance.depthMaterial.userData.darkness = {
      value: 5,
    };
    Shadow._instance.depthMaterial.onBeforeCompile = function (shader) {
      shader.uniforms.darkness =
        Shadow._instance.depthMaterial.userData.darkness;
      shader.fragmentShader = /* glsl */ `
						uniform float darkness;
						${shader.fragmentShader.replace(
              "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );",
              "gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );"
            )}
					`;
    };

    Shadow._instance.depthMaterial.depthTest = false;
    Shadow._instance.depthMaterial.depthWrite = false;

    Shadow._instance.horizontalBlurMaterial = new ShaderMaterial(
      HorizontalBlurShader
    );
    Shadow._instance.verticalBlurMaterial = new ShaderMaterial(
      VerticalBlurShader
    );
    Shadow._instance.horizontalBlurMaterial.depthTest = false;
    Shadow._instance.verticalBlurMaterial.depthTest = false;
  }

  blurShadow = function (amount: number, renderer: WebGLRenderer): void {
    Shadow._instance.blurPlane.visible = true;

    // blur horizontally and draw in the renderTargetBlur
    Shadow._instance.blurPlane.material =
      Shadow.Instance.horizontalBlurMaterial;

    //@ts-ignore uniforms
    Shadow._instance.blurPlane.material.uniforms.tDiffuse.value =
      Shadow._instance.renderTarget.texture;
    Shadow.Instance.horizontalBlurMaterial.uniforms.h.value =
      (amount * 1) / 256;

    renderer.setRenderTarget(Shadow.Instance.renderTargetBlur);
    renderer.render(Shadow._instance.blurPlane, Shadow.Instance.shadowCamera);

    // blur vertically and draw in the main renderTarget
    Shadow._instance.blurPlane.material = Shadow.Instance.verticalBlurMaterial;
    //@ts-ignore uniforms
    Shadow._instance.blurPlane.material.uniforms.tDiffuse.value =
      Shadow.Instance.renderTargetBlur.texture;
    Shadow.Instance.verticalBlurMaterial.uniforms.v.value = (amount * 1) / 256;

    renderer.setRenderTarget(Shadow.Instance.renderTarget);
    renderer.render(Shadow._instance.blurPlane, Shadow.Instance.shadowCamera);

    Shadow._instance.blurPlane.visible = false;
  };
}

export const shadowInstance = Shadow.Instance;
