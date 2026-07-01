const PUBLIC_KEY = "uX3xpXJ1b5DuWg1IP";
const SERVICE_ID = "service_ragtezv";
const TEMPLATE_ID = "template_qynarz6";

// EmailJS setup – https://dashboard.emailjs.com/admin/account
emailjs.init({
    publicKey: PUBLIC_KEY
});

window.onload = function () {

    var form = document.getElementById('contact-form');

    function showError(fieldId, message) {
        var errorBox = document.getElementById(fieldId + '-error');
        errorBox.textContent = message;
    }

    function clearErrors() {
        showError('fname',    '');
        showError('femail',   '');
        showError('fsubject', '');
        showError('fmessage', '');
        document.getElementById('form-status').textContent = '';
    }

    function isOnlyLetters(text) {
        var i;
        for (i = 0; i < text.length; i++) {
            var char = text[i];
            var ok = (char >= 'A' && char <= 'Z') ||
                     (char >= 'a' && char <= 'z') ||
                     char === ' ' || char === '.' ||
                     char === "'" || char === '-';
            if (!ok) {
                return false;
            }
        }
        return true;
    }

    function isValidEmail(email) {
        var atIndex  = email.indexOf('@');
        var dotIndex = email.lastIndexOf('.');

        if (atIndex < 1) return false;
        if (dotIndex <= atIndex + 1) return false;
        if (dotIndex >= email.length - 1) return false;
        if (email.indexOf(' ') !== -1) return false;

        return true;
    }

    function countDifferentChars(text) {
        var seen = [];
        var i, char;
        var textNoSpaces = '';

        for (i = 0; i < text.length; i++) {
            if (text[i] !== ' ') {
                textNoSpaces += text[i];
            }
        }

        for (i = 0; i < textNoSpaces.length; i++) {
            char = textNoSpaces[i];
            if (seen.indexOf(char) === -1) {
                seen.push(char);
            }
        }

        return seen.length;
    }

    function validateName(name) {
        if (name === '') {
            showError('fname', 'Please enter your name.');
            return false;
        }
        if (name.length < 3) {
            showError('fname', 'Name must be at least 3 characters.');
            return false;
        }
        if (!isOnlyLetters(name)) {
            showError('fname', 'Name should contain letters only.');
            return false;
        }
        if (countDifferentChars(name) < 2) {
            showError('fname', 'Please enter a valid name.');
            return false;
        }
        showError('fname', '');
        return true;
    }

    function validateEmail(email) {
        if (email === '') {
            showError('femail', 'Please enter your email address.');
            return false;
        }
        if (!isValidEmail(email)) {
            showError('femail', 'Please enter a valid email address.');
            return false;
        }
        showError('femail', '');
        return true;
    }

    function validateSubject(subject) {
        if (subject === '') {
            showError('fsubject', 'Please enter a subject.');
            return false;
        }
        var hasLetterOrNumber = false;
        var i;
        for (i = 0; i < subject.length; i++) {
            var c = subject[i];
            if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) {
                hasLetterOrNumber = true;
                break;
            }
        }
        if (!hasLetterOrNumber) {
            showError('fsubject', 'Please enter a valid subject.');
            return false;
        }
        showError('fsubject', '');
        return true;
    }

    function validateMessage(message) {
        if (message.length < 10) {
            showError('fmessage', 'Message must contain at least 10 characters.');
            return false;
        }
        if (countDifferentChars(message) < 3) {
            showError('fmessage', 'Please enter a meaningful message.');
            return false;
        }
        showError('fmessage', '');
        return true;
    }

    var nameInput = document.getElementById('fname');
    if (nameInput) {
        nameInput.addEventListener('blur', function () {
            validateName(nameInput.value.trim());
        });
    }

    var emailInput = document.getElementById('femail');
    if (emailInput) {
        emailInput.addEventListener('blur', function () {
            validateEmail(emailInput.value.trim());
        });
    }

    var subjectInput = document.getElementById('fsubject');
    if (subjectInput) {
        subjectInput.addEventListener('blur', function () {
            validateSubject(subjectInput.value.trim());
        });
    }

    var messageInput = document.getElementById('fmessage');
    if (messageInput) {
        messageInput.addEventListener('blur', function () {
            validateMessage(messageInput.value.trim());
        });
    }

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            clearErrors();

            var name    = document.getElementById('fname').value.trim();
            var email   = document.getElementById('femail').value.trim();
            var subject = document.getElementById('fsubject').value.trim();
            var message = document.getElementById('fmessage').value.trim();

            var nameOk    = validateName(name);
            var emailOk   = validateEmail(email);
            var subjectOk = validateSubject(subject);
            var messageOk = validateMessage(message);

            if (!nameOk || !emailOk || !subjectOk || !messageOk) {
                return;
            }

            sendForm(form);
        });
    }

    function sendForm(form) {
        var submitBtn    = form.querySelector('button[type="submit"]');
        var originalText = submitBtn.innerHTML;
        var status       = document.getElementById('form-status');

        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled  = true;

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form)
            .then(function () {
                status.classList.remove('text-red-400');
                status.classList.add('text-green-400');
                status.textContent = 'Message sent successfully!';
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled  = false;
            })
            .catch(function (error) {
                status.classList.remove('text-green-400');
                status.classList.add('text-red-400');
                status.textContent = 'Failed to send message. Please try again.';
                console.log('Email sending failed:', error);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled  = false;
            });
    }

};

function app() {
    return {

        dark: false,
        mm:   false,
        sc:   false,
        s:    'hero',

        init: function () {
            var savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                this.dark = true;
            } else if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.dark = true;
            }

            this.$watch('dark', function (newValue) {
                if (newValue) {
                    localStorage.setItem('theme', 'dark');
                } else {
                    localStorage.setItem('theme', 'light');
                }
            });

            var self = this;
            window.addEventListener('scroll', function () {
                self.sc = window.scrollY > 20;
                self.updateSection();
            }, { passive: true });

            var revealObserver = new IntersectionObserver(function (entries) {
                var i;
                for (i = 0; i < entries.length; i++) {
                    var entry = entries[i];
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        revealObserver.unobserve(entry.target);
                    }
                }
            }, {
                threshold:  0.1,
                rootMargin: '0px 0px -40px 0px'
            });

            var revealElements = document.querySelectorAll('.reveal');
            var j;
            for (j = 0; j < revealElements.length; j++) {
                revealObserver.observe(revealElements[j]);
            }

            var yearElement = document.getElementById('yr');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
        },

        updateSection: function () {
            var self = this;

            var nearBottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 60;
            if (nearBottom) {
                self.s = 'contact';
                return;
            }

            var sectionIds = ['contact', 'blog', 'about', 'work', 'services', 'hero'];
            var i;
            for (i = 0; i < sectionIds.length; i++) {
                var id      = sectionIds[i];
                var section = document.getElementById(id);
                if (section && window.scrollY >= section.offsetTop - 130) {
                    self.s = id;
                    return;
                }
            }
        }

    };
}
