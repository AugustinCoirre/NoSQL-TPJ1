// State management
let directors = [];
let movies = [];
let reviews = [];
let currentSection = 'directors';
let editMode = false;
let currentEditId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadAllData();
});

// Navigation
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(section) {
    currentSection = section;
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });
    
    // Update sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.toggle('active', sec.id === `${section}-section`);
    });
}

// Loading & Toast
function showLoading() {
    document.getElementById('loading').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('active');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Load all data
async function loadAllData() {
    showLoading();
    try {
        await Promise.all([
            loadDirectors(),
            loadMovies(),
            loadReviews()
        ]);
    } catch (error) {
        showToast('Erreur lors du chargement des données', 'error');
    } finally {
        hideLoading();
    }
}

// Directors
async function loadDirectors() {
    try {
        directors = await directorsAPI.getAll();
        renderDirectors();
    } catch (error) {
        console.error('Error loading directors:', error);
    }
}

function renderDirectors() {
    const container = document.getElementById('directors-list');
    
    if (directors.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-tie"></i>
                <p>Aucun réalisateur trouvé</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = directors.map(director => `
        <div class="card">
            <h3 class="card-title">${director.name}</h3>
            <div class="card-info">
                ${director.birth_year ? `<p><i class="fas fa-calendar"></i> Né en ${director.birth_year}</p>` : ''}
                ${director.nationality ? `<p><i class="fas fa-flag"></i> ${director.nationality}</p>` : ''}
                ${director.biography ? `<p><i class="fas fa-info-circle"></i> ${director.biography.substring(0, 100)}...</p>` : ''}
            </div>
            <div class="card-actions">
                <button class="btn btn-secondary btn-small" onclick="editDirector('${director._id}')">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteDirector('${director._id}')">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        </div>
    `).join('');
}

// Movies
async function loadMovies() {
    try {
        movies = await moviesAPI.getAll();
        renderMovies();
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

function renderMovies() {
    const container = document.getElementById('movies-list');
    
    if (movies.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-video"></i>
                <p>Aucun film trouvé</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = movies.map(movie => {
        const director = directors.find(d => d._id === movie.director_id);
        return `
            <div class="card">
                <h3 class="card-title">${movie.title}</h3>
                <div class="card-info">
                    <p><i class="fas fa-calendar"></i> ${movie.release_year}</p>
                    ${director ? `<p><i class="fas fa-user-tie"></i> ${director.name}</p>` : ''}
                    ${movie.genre ? `<p><i class="fas fa-tags"></i> ${movie.genre.join(', ')}</p>` : ''}
                    ${movie.duration ? `<p><i class="fas fa-clock"></i> ${movie.duration} min</p>` : ''}
                    ${movie.rating ? `<p><i class="fas fa-star"></i> <span class="rating">${movie.rating}/10</span></p>` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn btn-secondary btn-small" onclick="editMovie('${movie._id}')">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteMovie('${movie._id}')">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Reviews
async function loadReviews() {
    try {
        reviews = await reviewsAPI.getAll();
        renderReviews();
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

function renderReviews() {
    const container = document.getElementById('reviews-list');
    
    if (reviews.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-star"></i>
                <p>Aucune critique trouvée</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = reviews.map(review => {
        const movie = movies.find(m => m._id === review.movie_id);
        return `
            <div class="card">
                <h3 class="card-title">${movie ? movie.title : 'Film inconnu'}</h3>
                <div class="card-info">
                    <p><i class="fas fa-user"></i> ${review.author}</p>
                    <p><i class="fas fa-star"></i> <span class="rating">${review.rating}/10</span></p>
                    ${review.comment ? `<p><i class="fas fa-comment"></i> ${review.comment.substring(0, 100)}...</p>` : ''}
                    ${review.date ? `<p><i class="fas fa-calendar"></i> ${new Date(review.date).toLocaleDateString()}</p>` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn btn-secondary btn-small" onclick="editReview('${review._id}')">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteReview('${review._id}')">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Modal
function openModal(type, id = null) {
    editMode = !!id;
    currentEditId = id;
    
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('modal-form');
    
    modal.classList.add('active');
    
    if (type === 'director') {
        title.textContent = editMode ? 'Modifier le réalisateur' : 'Nouveau réalisateur';
        form.innerHTML = getDirectorForm(id);
    } else if (type === 'movie') {
        title.textContent = editMode ? 'Modifier le film' : 'Nouveau film';
        form.innerHTML = getMovieForm(id);
    } else if (type === 'review') {
        title.textContent = editMode ? 'Modifier la critique' : 'Nouvelle critique';
        form.innerHTML = getReviewForm(id);
    }
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    editMode = false;
    currentEditId = null;
}

// Forms
function getDirectorForm(id) {
    const director = id ? directors.find(d => d._id === id) : null;
    
    return `
        <div class="form-group">
            <label>Nom *</label>
            <input type="text" class="form-control" name="name" value="${director?.name || ''}" required>
        </div>
        <div class="form-group">
            <label>Année de naissance</label>
            <input type="number" class="form-control" name="birth_year" value="${director?.birth_year || ''}">
        </div>
        <div class="form-group">
            <label>Nationalité</label>
            <input type="text" class="form-control" name="nationality" value="${director?.nationality || ''}">
        </div>
        <div class="form-group">
            <label>Biographie</label>
            <textarea class="form-control" name="biography">${director?.biography || ''}</textarea>
        </div>
        <button type="button" class="btn btn-primary" onclick="submitDirectorForm()">
            ${editMode ? 'Modifier' : 'Créer'}
        </button>
    `;
}

function getMovieForm(id) {
    const movie = id ? movies.find(m => m._id === id) : null;
    
    const directorOptions = directors.map(d => 
        `<option value="${d._id}" ${movie?.director_id === d._id ? 'selected' : ''}>${d.name}</option>`
    ).join('');
    
    return `
        <div class="form-group">
            <label>Titre *</label>
            <input type="text" class="form-control" name="title" value="${movie?.title || ''}" required>
        </div>
        <div class="form-group">
            <label>Réalisateur *</label>
            <select class="form-control" name="director_id" required>
                <option value="">Sélectionner un réalisateur</option>
                ${directorOptions}
            </select>
        </div>
        <div class="form-group">
            <label>Année de sortie *</label>
            <input type="number" class="form-control" name="release_year" value="${movie?.release_year || ''}" required>
        </div>
        <div class="form-group">
            <label>Genres (séparés par des virgules)</label>
            <input type="text" class="form-control" name="genre" value="${movie?.genre?.join(', ') || ''}">
        </div>
        <div class="form-group">
            <label>Durée (minutes)</label>
            <input type="number" class="form-control" name="duration" value="${movie?.duration || ''}">
        </div>
        <div class="form-group">
            <label>Synopsis</label>
            <textarea class="form-control" name="synopsis">${movie?.synopsis || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Note (/10)</label>
            <input type="number" step="0.1" min="0" max="10" class="form-control" name="rating" value="${movie?.rating || ''}">
        </div>
        <button type="button" class="btn btn-primary" onclick="submitMovieForm()">
            ${editMode ? 'Modifier' : 'Créer'}
        </button>
    `;
}

function getReviewForm(id) {
    const review = id ? reviews.find(r => r._id === id) : null;
    
    const movieOptions = movies.map(m => 
        `<option value="${m._id}" ${review?.movie_id === m._id ? 'selected' : ''}>${m.title}</option>`
    ).join('');
    
    return `
        <div class="form-group">
            <label>Film *</label>
            <select class="form-control" name="movie_id" required>
                <option value="">Sélectionner un film</option>
                ${movieOptions}
            </select>
        </div>
        <div class="form-group">
            <label>Auteur *</label>
            <input type="text" class="form-control" name="author" value="${review?.author || ''}" required>
        </div>
        <div class="form-group">
            <label>Note (/10) *</label>
            <input type="number" step="0.1" min="0" max="10" class="form-control" name="rating" value="${review?.rating || ''}" required>
        </div>
        <div class="form-group">
            <label>Commentaire</label>
            <textarea class="form-control" name="comment">${review?.comment || ''}</textarea>
        </div>
        <button type="button" class="btn btn-primary" onclick="submitReviewForm()">
            ${editMode ? 'Modifier' : 'Créer'}
        </button>
    `;
}

// Form submissions
function getFormData() {
    const form = document.getElementById('modal-form');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (value) {
            if (key === 'genre') {
                data[key] = value.split(',').map(g => g.trim()).filter(g => g);
            } else if (key === 'birth_year' || key === 'release_year' || key === 'duration') {
                data[key] = parseInt(value);
            } else if (key === 'rating') {
                data[key] = parseFloat(value);
            } else {
                data[key] = value;
            }
        }
    }
    
    return data;
}

async function submitDirectorForm() {
    showLoading();
    try {
        const data = getFormData();
        
        if (editMode) {
            await directorsAPI.update(currentEditId, data);
            showToast('Réalisateur modifié avec succès');
        } else {
            await directorsAPI.create(data);
            showToast('Réalisateur créé avec succès');
        }
        
        await loadDirectors();
        closeModal();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function submitMovieForm() {
    showLoading();
    try {
        const data = getFormData();
        
        if (editMode) {
            await moviesAPI.update(currentEditId, data);
            showToast('Film modifié avec succès');
        } else {
            await moviesAPI.create(data);
            showToast('Film créé avec succès');
        }
        
        await loadMovies();
        closeModal();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function submitReviewForm() {
    showLoading();
    try {
        const data = getFormData();
        
        if (editMode) {
            await reviewsAPI.update(currentEditId, data);
            showToast('Critique modifiée avec succès');
        } else {
            await reviewsAPI.create(data);
            showToast('Critique créée avec succès');
        }
        
        await loadReviews();
        closeModal();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Edit functions
function editDirector(id) {
    openModal('director', id);
}

function editMovie(id) {
    openModal('movie', id);
}

function editReview(id) {
    openModal('review', id);
}

// Delete functions
async function deleteDirector(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce réalisateur ?')) return;
    
    showLoading();
    try {
        await directorsAPI.delete(id);
        showToast('Réalisateur supprimé avec succès');
        await loadDirectors();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function deleteMovie(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) return;
    
    showLoading();
    try {
        await moviesAPI.delete(id);
        showToast('Film supprimé avec succès');
        await loadMovies();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function deleteReview(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette critique ?')) return;
    
    showLoading();
    try {
        await reviewsAPI.delete(id);
        showToast('Critique supprimée avec succès');
        await loadReviews();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}