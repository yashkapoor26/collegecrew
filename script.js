// 3D Realistic Galaxy Background using Three.js
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 2000);
let renderer = new THREE.WebGLRenderer({canvas: document.getElementById('bg'), alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);

// Galaxy Skybox (procedural gradient + stars)
let galaxyGeometry = new THREE.SphereGeometry(900, 64, 64);
let galaxyMaterial = new THREE.MeshBasicMaterial({
  side: THREE.BackSide,
  map: null,
  color: 0x0a0a1a
});
// Procedural starfield texture
function generateGalaxyTexture() {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  // Gradient background
  let grad = ctx.createRadialGradient(size/2, size/2, size/8, size/2, size/2, size/2);
  grad.addColorStop(0, '#222a44');
  grad.addColorStop(0.4, '#1a1030');
  grad.addColorStop(0.7, '#0a0a1a');
  grad.addColorStop(1, '#000010');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  // Draw random stars
  for (let i = 0; i < 1200; i++) {
    let x = Math.random() * size;
    let y = Math.random() * size;
    let r = Math.random() * 1.2 + 0.2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.7 + 0.3})`;
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = Math.random() * 8 + 2;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  // Add several colorful nebula clouds (demo)
  const nebulaColors = [
    'rgba(123,104,238,0.22)', // purple
    'rgba(0,255,255,0.18)',   // cyan
    'rgba(255,99,71,0.13)',   // orange-red
    'rgba(255,255,255,0.10)', // white
    'rgba(255,20,147,0.15)'   // pink
  ];
  for (let i = 0; i < 7; i++) {
    let nx = Math.random() * size;
    let ny = Math.random() * size;
    let nr = Math.random() * 400 + 180;
    let color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
    let nebulaGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
    nebulaGrad.addColorStop(0, color);
    nebulaGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(nx, ny, nr, 0, 2 * Math.PI);
    ctx.fillStyle = nebulaGrad;
    ctx.fill();
  }
  let texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}
galaxyMaterial.map = generateGalaxyTexture();
let galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
scene.add(galaxy);

// Moving 3D stars (particles)
let starGeometry = new THREE.BufferGeometry();
let starCount = 900;
let starPositions = new Float32Array(starCount * 3);
let starSpeeds = [];
for (let i = 0; i < starCount; i++) {
  let theta = Math.random() * 2 * Math.PI;
  let phi = Math.acos(2 * Math.random() - 1);
  let radius = 350 + Math.random() * 500;
  starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
  starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
  starPositions[i * 3 + 2] = radius * Math.cos(phi);
  starSpeeds.push(0.02 + Math.random() * 0.04);
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
let starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: true, transparent: true, opacity: 0.85 });
let stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Lighting for realism
let light = new THREE.PointLight(0xffffff, 1.2, 0);
light.position.set(0, 0, 200);
scene.add(light);

// Camera initial position
camera.position.z = 80;
let zoomDirection = 1;
let zoomMin = 70, zoomMax = 120;

// Animate: subtle zoom, rotate, and move stars
function animate() {
  requestAnimationFrame(animate);
  // Subtle camera zoom in/out
  camera.position.z += 0.012 * zoomDirection;
  if (camera.position.z > zoomMax || camera.position.z < zoomMin) zoomDirection *= -1;
  // Slow rotation for endless feel
  scene.rotation.y += 0.0007;
  scene.rotation.x += 0.0002;
  // Move stars slightly for depth
  let positions = starGeometry.attributes.position.array;
  for (let i = 0; i < starCount; i++) {
    let idx = i * 3;
    let angle = Math.atan2(positions[idx + 1], positions[idx]);
    let dist = Math.sqrt(positions[idx] * positions[idx] + positions[idx + 1] * positions[idx + 1]);
    angle += 0.0002 * starSpeeds[i];
    positions[idx] = dist * Math.cos(angle);
    positions[idx + 1] = dist * Math.sin(angle);
  }
  starGeometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 3D Menu logic
const menuButton = document.getElementById('menuButton');
const menu3d = document.getElementById('menu3d');
const modal = document.getElementById('modal');
const orgChartSection = document.getElementById('orgChartSection');
const contactSection = document.getElementById('contactSection');
const aboutBtn = document.getElementById('aboutBtn');
const homeSection = document.getElementById('homeSection');

function closeAllSections() {
  modal.classList.remove('show');
  orgChartSection.classList.remove('show');
  contactSection.classList.remove('show');
  homeSection.style.display = '';
}
// Update all close buttons to call closeAllSections
window.closeAllSections = closeAllSections;

menuButton.onclick = function() {
  menuButton.classList.toggle('active');
  menu3d.classList.toggle('active');
};

menu3d.querySelectorAll('.menu-item').forEach(item => {
  item.onclick = function() {
    menuButton.classList.remove('active');
    menu3d.classList.remove('active');
    closeAllSections();
    const section = item.getAttribute('data-section');
    if (section === 'home') showHome();
    if (section === 'join') showJoinCommunity();
    if (section === 'explore') showOrgChart();
    if (section === 'about') showModal('About', '<div style="text-align:center;font-size:1.5rem;">Under Construction</div>');
    if (section === 'motto') showModal('Our Motto', '<div style="text-align:center;font-size:1.5rem;">Under Construction</div>');
    if (section === 'contact') showContactSection();
    if (section === 'help') showModal('Help', '<div style="text-align:center;">For help, contact us at <b>collegecrew@gmail.com</b> or call <b>+91 9758648712</b>.</div>');
  };
});

function showHome() {
  closeAllSections();
  homeSection.style.display = '';
}

aboutBtn.onclick = function() {
  showAboutFoundersModal();
};

function showAboutFoundersModal() {
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-btn" onclick="window.closeAllSections()">&times;</button>
      <h2>About & Founders</h2>
      <div class="modal-btns" style="display:flex;gap:20px;justify-content:center;margin-bottom:20px;">
        <button id="aboutCompanyBtn" class="modal-btn">About Company</button>
        <button id="aboutFoundersBtn" class="modal-btn">About Founders</button>
      </div>
      <div id="aboutFoundersContent"></div>
    </div>
  `;
  modal.classList.add('show');
  homeSection.style.display = 'none';
  document.getElementById('aboutCompanyBtn').onclick = function() {
    document.getElementById('aboutFoundersContent').innerHTML = '<div style="text-align:center;font-size:1.3rem;">Coming Soon</div>';
  };
  document.getElementById('aboutFoundersBtn').onclick = function() {
    document.getElementById('aboutFoundersContent').innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="position:relative;display:flex;flex-direction:column;align-items:center;min-height:160px;">
          <div style="position:absolute;top:-60px;left:50%;transform:translateX(-50%);z-index:2;">
            <img src="founder.jpg" style="width:100px;height:100px;border-radius:50%;border:5px solid #fff;box-shadow:0 4px 24px #7b68ee55,0 0 0 8px #000a;object-fit:cover;background:#fff;"/>
          </div>
          <div style="margin-top:50px;background:#fff;border-radius:18px;box-shadow:0 8px 32px #7b68ee55;padding:32px 24px;min-width:320px;max-width:90vw;display:flex;flex-direction:column;align-items:center;">
            <button id="yashKapoorBtn" class="main-btn" style="width:220px;font-size:1.1rem;margin-bottom:18px;display:flex;align-items:center;justify-content:center;gap:10px;">YASH KAPOOR</button>
            <div id="yashKapoorContent"></div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('yashKapoorBtn').onclick = function() {
      document.getElementById('yashKapoorContent').innerHTML = `
        <div style="color:#222;font-family:'Georgia',serif;text-align:left;max-width:500px;">
          <div style="font-size:1.2rem;font-weight:bold;margin-bottom:10px;">SUMMARY</div>
          <div style="margin-bottom:18px;">Yash Kapoor is a young innovator and founder-minded technologist from NIT Bhopal, blending engineering precision with entrepreneurial instinct. With a strong hold in product design, sponsorship strategy, and AI tools, he's shaping ideas into impactful solutions. Passionate about building what people actually need, Yash stands out for converting vision into prototypes — fast, focused, and fearless.</div>
          <div style="font-size:1.1rem;font-weight:bold;margin-bottom:8px;">Experiences</div>
          <ul style="margin-bottom:18px;">
            <li><b>FiNIT – The Finance Society, NIT Bhopal</b><br>Sponsorship Executive — Apr 2025 – Present<br>Built corporate partnerships and drove sponsor communication strategy. Developed decks, handled cold outreach, and maintained brand relations.</li>
            <li><b>Growbinar</b><br>Campus Ambassador — May 2025 – Present<br>Promoted product awareness and organized campaign activities across campus. Built student engagement funnels and reported insights.</li>
            <li><b>Evolve – Tech Society, NIT Bhopal</b><br>Technical Executive — Apr 2025 – Present<br>Contributed to technical event planning, codebase development, and troubleshooting. Participated in AI and logic-building modules.</li>
            <li><b>E-Cell, NIT Bhopal</b><br>Freshers' Representative — Jan 2025 – Mar 2025<br>Acted as a bridge between new entrants and society leads. Assisted in organizing workshops and funding drives.</li>
            <li><b>Joveo</b><br>Product & Research Intern — Feb 2025 – July 2025<br>Worked closely with the product and data teams to research user behavior and suggest optimizations for job ad targeting. Developed structured insights and contributed to internal tools. Earned: $200 during the internship for performance-based contributions.</li>
          </ul>
          <div style="font-size:1.1rem;font-weight:bold;margin-bottom:8px;">Education</div>
          <ul>
            <li>Maulana Azad National Institute of Technology (MANIT), Bhopal<br>B.Tech in Electrical Engineering | Aug 2024 – Sep 2028</li>
            <li>Darshan Academy<br>Completed Schooling | 2017 – 2024</li>
          </ul>
        </div>
      `;
    };
  };
}

function showModal(title, content) {
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-btn" onclick="window.closeAllSections()">&times;</button>
      <h2>${title}</h2>
      <div>${content}</div>
    </div>
  `;
  modal.classList.add('show');
  homeSection.style.display = 'none';
}

function showJoinCommunity() {
  showModal('Join the Community', `
    <div style="display:flex;gap:20px;justify-content:center;flex-wrap:wrap;">
      <button class="main-btn" onclick="window.open('https://www.instagram.com/', '_blank')">Instagram</button>
      <button class="main-btn" onclick="window.open('https://chat.whatsapp.com/DF9MVU1VpaYFdo5JPqpskV', '_blank')">WhatsApp</button>
      <button class="main-btn" onclick="window.open('https://x.com/', '_blank')">X</button>
      <button class="main-btn" onclick="window.open('https://linkedin.com/', '_blank')">LinkedIn</button>
    </div>
  `);
}

function showOrgChart() {
  closeAllSections();
  // Generate 5 crazy, floating, 3D org blocks
  let orgBlocks = '';
  for (let i = 0; i < 5; i++) {
    // Random 3D transform for crazy floating effect
    const rotate = Math.random() * 30 - 15;
    const floatDelay = (Math.random() * 1.5).toFixed(2);
    orgBlocks += `<div class="org-block crazy-float" style="transform: rotateZ(${rotate}deg) scale(1.05); animation-delay: ${floatDelay}s;">
      <span class="question">?</span><span class="subtitle">coming soon</span>
    </div>`;
  }
  orgChartSection.innerHTML = `
    <div class="org-chart">
      <div class="org-founder outstanding-founder" style="min-width:360px;max-width:96vw;padding:38px 32px 22px 32px;">
        <img src="founder.jpg" class="org-founder-photo" style="width:120px;height:120px;margin-bottom:18px;box-shadow:0 4px 24px #7b68ee55,0 0 0 8px #000a;"/>
        <div class="org-founder-title" style="font-size:1.4rem;font-weight:bold;color:#7b68ee;letter-spacing:2px;text-shadow:0 2px 12px #7b68ee77,0 0 2px #fff;margin-bottom:6px;">FOUNDER & CEO</div>
        <div class="org-founder-name" style="font-size:2.3rem;font-weight:bold;color:#222;letter-spacing:2px;text-shadow:0 2px 12px #fff,0 0 2px #7b68ee;">Yash Kapoor</div>
      </div>
      <div class="org-chart-connector"></div>
      <div class="org-chart-branches">${orgBlocks}</div>
    </div>
  `;
  orgChartSection.classList.add('show');
  homeSection.style.display = 'none';
}

function showContactSection() {
  closeAllSections();
  contactSection.innerHTML = `
    <div class="contact-tips">
      <b>Safety Precautions:</b><br>
      <ul>
        <li>Never share your personal or financial information with untrusted sources.</li>
        <li>Beware of phishing links and always verify URLs before clicking.</li>
        <li>Use strong, unique passwords for your accounts.</li>
        <li>Report any suspicious activity to the site admin immediately.</li>
        <li>Keep your browser and security software up to date.</li>
      </ul>
    </div>
    <div class="contact-info">
      <b>Contact Us</b><br>
      Email: <a href="mailto:collegecrew@gmail.com" style="color:#7b68ee;">collegecrew@gmail.com</a><br>
      Toll Free: <a href="tel:+919758648712" style="color:#7b68ee;">+91 9758648712</a>
    </div>
  `;
  contactSection.classList.add('show');
  homeSection.style.display = 'none';
}

// Nebula Demo: To see only the nebula clouds, call demoNebula() in the browser console or temporarily replace animate() with demoNebula() below.
// DEMO: Render only nebula clouds for preview
function demoNebula() {
  // Clear the scene
  while(scene.children.length > 0){ scene.remove(scene.children[0]); }
  renderer.setClearColor(0x000010, 1);

  // Create a flat plane to show the nebula texture
  const size = 2048;
  const nebulaTexture = (function() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    // Black background
    ctx.fillStyle = '#000010';
    ctx.fillRect(0, 0, size, size);
    // Nebula colors
    const nebulaColors = [
      'rgba(123,104,238,0.22)', // purple
      'rgba(0,255,255,0.18)',   // cyan
      'rgba(255,99,71,0.13)',   // orange-red
      'rgba(255,255,255,0.10)', // white
      'rgba(255,20,147,0.15)'   // pink
    ];
    for (let i = 0; i < 7; i++) {
      let nx = Math.random() * size;
      let ny = Math.random() * size;
      let nr = Math.random() * 400 + 180;
      let color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      let nebulaGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
      nebulaGrad.addColorStop(0, color);
      nebulaGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(nx, ny, nr, 0, 2 * Math.PI);
      ctx.fillStyle = nebulaGrad;
      ctx.fill();
    }
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  })();
  let planeGeo = new THREE.PlaneGeometry(16, 16);
  let planeMat = new THREE.MeshBasicMaterial({ map: nebulaTexture, transparent: true });
  let plane = new THREE.Mesh(planeGeo, planeMat);
  scene.add(plane);
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);
  function renderDemo() {
    requestAnimationFrame(renderDemo);
    renderer.render(scene, camera);
  }
  renderDemo();
}
