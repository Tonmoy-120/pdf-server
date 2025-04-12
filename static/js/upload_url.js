const uploadBtn = document.getElementById('upload-btn');
const textInput = document.getElementById('text-input');
const statusMessage = document.getElementById('status-message');

function goBack() {
  if (document.referrer && new URL(document.referrer).origin === location.origin) {
    window.history.back();
  } else {
    window.location.href = "/";
  }
}

function addStatus(text, type) {
  statusMessage.textContent = text;
  let colorClass = "";
  switch (type) {
    case "success": colorClass = "text-success"; break;
    case "error": colorClass = "text-danger"; break;
    case "warning": colorClass = "text-warning"; break;
    default: colorClass = "text-primary";
  }
  statusMessage.className = `mt-3 ${colorClass}`;
}

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function uploadTextInput(text) {
  const trimmed = text.trim();

  if (!trimmed) {
    addStatus('Please enter a valid URL pointing to a PDF.', 'warning');
    return;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    if (!isValidURL(trimmed)) {
      addStatus('Invalid URL format.', 'error');
      return;
    }

    if (!trimmed.toLowerCase().endsWith(".pdf")) {
      addStatus('The URL does not appear to be a direct PDF link.', 'warning');
    }
  } else {
    addStatus('Only PDF URLs are allowed.', 'error');
    return;
  }

  addStatus('Uploading...', 'info');

  fetch('/upload-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: trimmed })
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200) {
        addStatus(body.message || 'Uploaded successfully!', 'success');
      } else {
        addStatus(body.message || 'Upload failed.', 'error');
      }
    })
    .catch(error => {
      console.error('Upload error:', error);
      addStatus('An error occurred during upload.', 'error');
    });
}

uploadBtn.addEventListener('click', (e) => {
  e.preventDefault();
  uploadTextInput(textInput.value);
});
