async function loadProjectData(projectId) {
  try {
    const res = await fetch('projects.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Não foi possível carregar projects.json');
    const data = await res.json();
    return data[projectId] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function populateProjectPage(project) {
  if (!project) return;
  const titleEl = document.getElementById('project-title');
  const introEl = document.getElementById('project-intro');
  const descEl = document.getElementById('project-description');
  const gallery = document.getElementById('project-gallery');
  if (titleEl) titleEl.innerText = project.title || '';
  if (introEl) introEl.innerText = project.intro || '';
  if (descEl) descEl.innerText = project.description || '';
  if (gallery && Array.isArray(project.images)) {
    gallery.innerHTML = '';
    project.images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = project.title || '';
      gallery.appendChild(img);
    });
  }
}

export { loadProjectData, populateProjectPage };
