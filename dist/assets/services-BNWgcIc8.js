import{a as u,S as p,L as S,D as f,P as h}from"./vendor-deps-BhKvdKuR.js";typeof window<"u"&&!window.global&&(window.global=window);const d="/api";class ${async register(r){try{const e=await u.post(`${d}/auth/register`,r);return e.data.token&&(localStorage.setItem("token",e.data.token),localStorage.setItem("user",JSON.stringify(e.data.user))),e.data}catch(e){throw console.error("Error en el registro:",e),e}}async login(r){try{const e=await u.post(`${d}/auth/login`,r);return e.data.token&&(localStorage.setItem("token",e.data.token),localStorage.setItem("user",JSON.stringify(e.data.user))),e.data}catch(e){throw console.error("Error en el inicio de sesión:",e),e}}logout(){localStorage.removeItem("token"),localStorage.removeItem("user")}isAuthenticated(){return!!localStorage.getItem("token")}getToken(){return localStorage.getItem("token")}getCurrentUser(){const r=localStorage.getItem("user");return r?JSON.parse(r):null}}const b=new $,c={region:"us-east-2",credentials:{accessKeyId:"",secretAccessKey:""}};console.log("Cargando variables de entorno S3:");console.log("- Region:",void 0);console.log("- Access Key ID:","No configurado");console.log("- Secret Key:","No configurado");console.log("- Bucket:","restaurant-items-by-danielxxomg");const n="restaurant-items-by-danielxxomg",l=new p(c);function x(o){if(o.startsWith("https://")){const e=new RegExp(`https://${n}\\.s3\\..*\\.amazonaws\\.com/(.+)`),t=o.match(e);if(t&&t[1])o=t[1];else return o}return`${`https://${n}.s3.${c.region}.amazonaws.com`}/${o}`}const C=async(o,r="uploads",e)=>{try{let t=o.name;if(e){const i=t.split(".").pop();t=`${e}.${i}`}else{const i=Math.random().toString(36).substring(2,10),m=new Date().toISOString().replace(/[-:.]/g,""),y=t.substring(0,t.lastIndexOf(".")),w=t.split(".").pop();t=`${y}_${m}_${i}.${w}`}const a=`${r}/${t}`,s=await o.arrayBuffer(),g=new h({Bucket:n,Key:a,Body:new Uint8Array(s),ContentType:o.type});return await l.send(g),{success:!0,url:`https://${n}.s3.${c.region}.amazonaws.com/${a}`,key:a}}catch(t){return console.error("Error al subir archivo a S3:",t),{success:!1,error:t instanceof Error?t.message:"Error desconocido"}}},K=async(o="uploads",r=100)=>{try{const e=o.endsWith("/")?o:`${o}/`,t=new S({Bucket:n,Prefix:e,MaxKeys:r}),a=await l.send(t);return a.Contents?a.Contents.filter(s=>s.Key!==e).map(s=>({key:s.Key,url:`https://${n}.s3.${c.region}.amazonaws.com/${s.Key}`,size:s.Size,lastModified:s.LastModified})):[]}catch(e){return console.error("Error al listar archivos de S3:",e),[]}},E=async o=>{try{const r=new f({Bucket:n,Key:o});return await l.send(r),!0}catch(r){return console.error("Error al eliminar archivo de S3:",r),!1}};export{b as a,E as d,x as g,K as l,C as u};
