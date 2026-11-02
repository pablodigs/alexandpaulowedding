
/* =========================================
   ALEX & PAULO
   ANGLES & PERSPECTIVES
   SUPABASE PHOTO SHARING
========================================= */


/* =========================================
   1. SUPABASE CONNECTION
========================================= */

const SUPABASE_URL =
    "https://xhtcszatnfmnqjtrjwhh.supabase.co";


const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodGNzemF0bmZtbnFqdHJqd2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMzE0MjUsImV4cCI6MjEwNjYwNzQyNX0.SiNVD3vDqt5sf_folcO1SKp9Hy46NMAIXI3fBT-Z0Kk";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

const PHOTO_BUCKET = "wedding-photos";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const PAGE_SIZE = 30;


/* =========================================
   2. ELEMENTS
========================================= */

const uploadForm =
    document.getElementById("uploadForm");

const guestNameInput =
    document.getElementById("guestName");

const captionInput =
    document.getElementById("caption");

const photoInput =
    document.getElementById("photoInput");

const browseButton =
    document.getElementById("browseButton");

const uploadBox =
    document.getElementById("uploadBox");

const previewSection =
    document.getElementById("previewSection");

const previewGrid =
    document.getElementById("previewGrid");

const photoCount =
    document.getElementById("photoCount");

const uploadButton =
    document.getElementById("uploadButton");

const uploadMessage =
    document.getElementById("uploadMessage");

const uploadProgress =
    document.getElementById("uploadProgress");

const progressText =
    document.getElementById("progressText");

const progressPercent =
    document.getElementById("progressPercent");

const progressBar =
    document.getElementById("progressBar");

const galleryGrid =
    document.getElementById("galleryGrid");

const galleryCount =
    document.getElementById("galleryCount");

const loadMoreButton =
    document.getElementById("loadMoreButton");

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxCaption =
    document.getElementById("lightboxCaption");

const lightboxClose =
    document.getElementById("lightboxClose");

const lightboxPrev =
    document.getElementById("lightboxPrev");

const lightboxNext =
    document.getElementById("lightboxNext");


/* =========================================
   3. STATE
========================================= */

let selectedFiles = [];

let galleryPhotos = [];

let currentLightboxIndex = 0;

let currentPage = 0;

let isUploading = false;

let isPreparingPhotos = false;

let isLoadingGallery = false;

let hasMorePhotos = true;


/* =========================================
   4. HELPER FUNCTIONS
========================================= */

function showMessage(message, type = "success") {

    uploadMessage.textContent = message;

    uploadMessage.classList.toggle(
        "error",
        type === "error"
    );

}


function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-PH",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

}


function formatFileSize(bytes) {

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";

}


/* =========================================
   STORAGE CAPACITY ERROR DETECTOR
========================================= */

function isStorageCapacityError(error) {

    if (!error) return false;

    const message = [
        error.message,
        error.error,
        error.details,
        error.hint,
        error.code
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    const capacityKeywords = [
        "storage quota",
        "quota exceeded",
        "storage limit",
        "storage capacity",
        "exceeded your storage",
        "exceeded the storage",
        "maximum storage",
        "not enough storage",
        "insufficient storage",
        "storagequotaexceeded",
        "quotaexceeded",
        "project storage"
    ];

    return capacityKeywords.some(function (keyword) {

        return message.includes(keyword);

    });

}


/* =========================================
   INDIVIDUAL FILE SIZE ERROR DETECTOR
========================================= */

function isFileSizeError(error) {

    if (!error) return false;

    const message = [
        error.message,
        error.error,
        error.details,
        error.hint
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return (
        message.includes("maximum allowed size") ||
        message.includes("file size limit") ||
        message.includes("file too large") ||
        message.includes("object exceeded")
    );

}


function updateUploadButton() {

    uploadButton.disabled =
        selectedFiles.length === 0 ||
        isUploading ||
        isPreparingPhotos;

    browseButton.disabled =
        isUploading ||
        isPreparingPhotos;

    uploadButton.textContent =
        isUploading
            ? "UPLOADING PHOTOS..."
            : isPreparingPhotos
                ? "PREPARING PHOTOS..."
                : "SHARE YOUR PHOTOS";

}


/* =========================================
   5. PHOTO PREVIEW
========================================= */

function renderPreviews() {

    previewGrid.innerHTML = "";

    photoCount.textContent =
        `${selectedFiles.length} selected`;

    previewSection.classList.toggle(
        "hidden",
        selectedFiles.length === 0
    );

    selectedFiles.forEach(function (item, index) {

        const wrapper =
            document.createElement("div");

        wrapper.className = "preview-item";

        const image =
            document.createElement("img");

        image.src = item.previewURL;

        image.alt = "Selected wedding photo";

        const removeButton =
            document.createElement("button");

        removeButton.type = "button";

        removeButton.className = "remove-preview";

        removeButton.textContent = "×";

        removeButton.setAttribute(
            "aria-label",
            "Remove selected photo"
        );

        removeButton.addEventListener(
            "click",
            function () {

                if (
                    isUploading ||
                    isPreparingPhotos
                ) {
                    return;
                }

                URL.revokeObjectURL(
                    item.previewURL
                );

                selectedFiles.splice(index, 1);

                renderPreviews();

                updateUploadButton();

            }
        );

        wrapper.appendChild(image);

        wrapper.appendChild(removeButton);

        previewGrid.appendChild(wrapper);

    });

}


/* =========================================
   6. ADD SELECTED PHOTOS
   SUPPORTS:
   JPG, JPEG, PNG, WEBP, HEIC, HEIF
========================================= */

async function addPhotos(files) {

    if (
        isUploading ||
        isPreparingPhotos
    ) {
        return;
    }

    const incomingFiles =
        Array.from(files);

    if (incomingFiles.length === 0) {
        return;
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    isPreparingPhotos = true;

    updateUploadButton();

    try {

        for (const originalFile of incomingFiles) {

            if (selectedFiles.length >= MAX_FILES) {

                showMessage(
                    "You can select a maximum of 10 photos per upload.",
                    "error"
                );

                break;

            }

            if (originalFile.size > MAX_FILE_SIZE) {

                showMessage(
                    `${originalFile.name} exceeds the 8 MB limit.`,
                    "error"
                );

                continue;

            }

            const fileName =
                originalFile.name.toLowerCase();

            const isHEIC =
                originalFile.type === "image/heic" ||
                originalFile.type === "image/heif" ||
                originalFile.type === "image/heic-sequence" ||
                originalFile.type === "image/heif-sequence" ||
                fileName.endsWith(".heic") ||
                fileName.endsWith(".heif");

            let file = originalFile;

            if (isHEIC) {

                if (
                    typeof window.heic2any !== "function"
                ) {

                    showMessage(
                        "The HEIC converter could not load. Please refresh the page and try again.",
                        "error"
                    );

                    continue;

                }

                try {

                    showMessage(
                        `Preparing iPhone photo: ${originalFile.name}`
                    );

                    const convertedResult =
                        await window.heic2any({

                            blob: originalFile,

                            toType: "image/jpeg",

                            quality: 0.9

                        });

                    const convertedBlob =
                        Array.isArray(convertedResult)
                            ? convertedResult[0]
                            : convertedResult;

                    if (!convertedBlob) {

                        throw new Error(
                            "HEIC conversion returned no image."
                        );

                    }

                    const convertedName =
                        originalFile.name.replace(
                            /\.(heic|heif)$/i,
                            ".jpg"
                        );

                    file = new File(
                        [convertedBlob],
                        convertedName,
                        {
                            type: "image/jpeg",

                            lastModified:
                                originalFile.lastModified
                        }
                    );

                } catch (error) {

                    console.error(
                        "HEIC conversion error:",
                        error
                    );

                    showMessage(
                        `${originalFile.name} could not be converted. Please try another photo or use JPG format.`,
                        "error"
                    );

                    continue;

                }

            } else if (
                !allowedTypes.includes(originalFile.type)
            ) {

                showMessage(
                    `${originalFile.name} is not supported. Please use JPG, PNG, WebP, HEIC, or HEIF.`,
                    "error"
                );

                continue;

            }

            const alreadySelected =
                selectedFiles.some(function (item) {

                    return (
                        item.file.name === file.name &&
                        item.file.size === file.size &&
                        item.file.lastModified === file.lastModified
                    );

                });

            if (alreadySelected) {
                continue;
            }

            selectedFiles.push({

                file: file,

                previewURL:
                    URL.createObjectURL(file)

            });

            renderPreviews();

        }

    } finally {

        isPreparingPhotos = false;

        renderPreviews();

        updateUploadButton();

    }

}


/* =========================================
   7. FILE SELECTION
========================================= */

browseButton.addEventListener(
    "click",
    function () {

        if (
            isUploading ||
            isPreparingPhotos
        ) {
            return;
        }

        photoInput.click();

    }
);


photoInput.addEventListener(
    "change",
    function () {

        const files =
            Array.from(photoInput.files);

        photoInput.value = "";

        addPhotos(files);

    }
);


/* =========================================
   8. DRAG AND DROP
========================================= */

["dragenter", "dragover"].forEach(
    function (eventName) {

        uploadBox.addEventListener(
            eventName,
            function (event) {

                event.preventDefault();

                uploadBox.classList.add("dragging");

            }
        );

    }
);


["dragleave", "drop"].forEach(
    function (eventName) {

        uploadBox.addEventListener(
            eventName,
            function (event) {

                event.preventDefault();

                uploadBox.classList.remove("dragging");

            }
        );

    }
);


uploadBox.addEventListener(
    "drop",
    function (event) {

        if (
            isUploading ||
            isPreparingPhotos
        ) {
            return;
        }

        addPhotos(event.dataTransfer.files);

    }
);


/* =========================================
   9. IMAGE COMPRESSION
   CONVERTS PHOTOS TO WEBP
========================================= */

async function compressImage(file) {

    const image =
        await createImageBitmap(file);

    const MAX_DIMENSION = 1920;

    let width = image.width;

    let height = image.height;

    if (
        width > MAX_DIMENSION ||
        height > MAX_DIMENSION
    ) {

        const scale = Math.min(
            MAX_DIMENSION / width,
            MAX_DIMENSION / height
        );

        width = Math.round(width * scale);

        height = Math.round(height * scale);

    }

    const canvas =
        document.createElement("canvas");

    canvas.width = width;

    canvas.height = height;

    const context =
        canvas.getContext("2d");

    context.drawImage(
        image,
        0,
        0,
        width,
        height
    );

    image.close();

    return new Promise(function (resolve, reject) {

        canvas.toBlob(
            function (blob) {

                if (!blob) {

                    reject(
                        new Error(
                            "Image compression failed."
                        )
                    );

                    return;

                }

                resolve(blob);

            },

            "image/webp",

            0.82

        );

    });

}


/* =========================================
   10. UPLOAD PROGRESS
========================================= */

function updateProgress(completed, total) {

    const percentage =
        Math.round((completed / total) * 100);

    progressBar.style.width =
        `${percentage}%`;

    progressPercent.textContent =
        `${percentage}%`;

    progressText.textContent =
        `Uploading photo ${completed} of ${total}`;

}


/* =========================================
   11. UPLOAD PHOTOS TO SUPABASE
========================================= */

async function uploadPhotos(event) {

    event.preventDefault();

    if (
        isUploading ||
        isPreparingPhotos
    ) {
        return;
    }

    const guestName =
        guestNameInput.value.trim();

    const caption =
        captionInput.value.trim();


    /* =========================
       VALIDATE GUEST NAME
    ========================= */

    if (!guestName) {

        showMessage(
            "Please enter your name.",
            "error"
        );

        guestNameInput.focus();

        return;

    }

    if (guestName.length > 80) {

        showMessage(
            "Your name is too long.",
            "error"
        );

        return;

    }


    /* =========================
       VALIDATE CAPTION
    ========================= */

    if (caption.length > 200) {

        showMessage(
            "Your caption cannot exceed 200 characters.",
            "error"
        );

        return;

    }


    /* =========================
       CHECK SELECTED PHOTOS
    ========================= */

    if (selectedFiles.length === 0) {

        showMessage(
            "Please select at least one photo.",
            "error"
        );

        return;

    }


    isUploading = true;

    updateUploadButton();

    uploadProgress.classList.remove("hidden");

    uploadMessage.textContent = "";

    progressBar.style.width = "0%";

    progressPercent.textContent = "0%";


    const filesToUpload =
        [...selectedFiles];

    const totalFiles =
        filesToUpload.length;

    let successfulUploads = 0;

    let failedUploads = 0;

    let storageCapacityReached = false;

    let fileSizeRestrictionReached = false;

    const successfulItems = [];

    const failedItems = [];


    try {

        for (
            let index = 0;
            index < totalFiles;
            index++
        ) {

            const item =
                filesToUpload[index];

            try {

                /* =========================
                   COMPRESS PHOTO
                ========================= */

                progressText.textContent =
                    `Preparing photo ${index + 1} of ${totalFiles}`;

                const compressedBlob =
                    await compressImage(item.file);

                const extension =
                    compressedBlob.type === "image/webp"
                        ? "webp"
                        : "jpg";

                const filePath =
                    `uploads/${crypto.randomUUID()}.${extension}`;


                /* =========================
                   UPLOAD IMAGE TO STORAGE
                ========================= */

                const { error: storageError } =
                    await supabaseClient
                        .storage
                        .from(PHOTO_BUCKET)
                        .upload(
                            filePath,
                            compressedBlob,
                            {
                                contentType:
                                    compressedBlob.type,

                                cacheControl: "3600",

                                upsert: false
                            }
                        );


                if (storageError) {

                    /* =========================
                       CHECK STORAGE CAPACITY
                    ========================= */

                    if (
                        isStorageCapacityError(storageError)
                    ) {

                        storageCapacityReached = true;

                        throw storageError;

                    }


                    /* =========================
                       CHECK FILE SIZE RESTRICTION
                    ========================= */

                    if (
                        isFileSizeError(storageError)
                    ) {

                        fileSizeRestrictionReached = true;

                    }

                    throw storageError;

                }


                /* =========================
                   SAVE PHOTO INFORMATION
                   TO WEDDINGPHOTOS TABLE
                ========================= */

                const { error: databaseError } =
                    await supabaseClient
                        .from("WeddingPhotos")
                        .insert({

                            guest_name: guestName,

                            caption: caption || null,

                            storage_path: filePath

                        });


                if (databaseError) {

                    throw databaseError;

                }


                /* =========================
                   MARK AS SUCCESSFUL
                ========================= */

                successfulUploads++;

                successfulItems.push(item);

            } catch (error) {

                console.error(
                    "Photo upload error:",
                    error
                );

                failedUploads++;

                failedItems.push(item);

            }


            /* =========================
               STOP IF STORAGE IS FULL
            ========================= */

            if (storageCapacityReached) {

                // Preserve every photo that has
                // not yet been attempted.

                const remainingItems =
                    filesToUpload.slice(index + 1);

                failedItems.push(
                    ...remainingItems
                );

                failedUploads +=
                    remainingItems.length;

                break;

            }


            updateProgress(
                index + 1,
                totalFiles
            );

        }


        /* =========================
           CLEAN UP SUCCESSFUL PHOTOS
           PRESERVE FAILED PHOTOS
        ========================= */

        if (successfulUploads > 0) {

            successfulItems.forEach(
                function (item) {

                    URL.revokeObjectURL(
                        item.previewURL
                    );

                }
            );

        }

        selectedFiles = failedItems;

        renderPreviews();

        updateUploadButton();


        /* =========================
           REFRESH GALLERY
        ========================= */

        if (successfulUploads > 0) {

            await loadGallery(true);

        }


        /* =========================
           DISPLAY UPLOAD RESULTS
        ========================= */

        if (storageCapacityReached) {

            if (successfulUploads > 0) {

                showMessage(
                    `${successfulUploads} photos were uploaded successfully, but our shared album has reached its storage capacity. The remaining photos are still in your preview. Please try again later. Thank you for sharing your memories with us!`,
                    "error"
                );

            } else {

                showMessage(
                    "Our photo gallery has reached its upload capacity. Uploads are temporarily unavailable. Please try again later. Thank you for sharing your memories with us!",
                    "error"
                );

            }

        } else if (fileSizeRestrictionReached) {

            showMessage(
                successfulUploads > 0
                    ? `${successfulUploads} photos uploaded successfully. Some photos exceeded the storage file-size restriction. Your unsuccessful photos are still in the preview.`
                    : "One or more photos exceeded the allowed file-size limit. Your selected photos are still in the preview.",
                "error"
            );

        } else if (failedUploads === 0) {

            showMessage(
                successfulUploads === 1
                    ? "Your photo has been shared successfully. Thank you!"
                    : `${successfulUploads} photos have been shared successfully. Thank you!`
            );

        } else if (successfulUploads > 0) {

            showMessage(
                `${successfulUploads} photos uploaded successfully. ${failedUploads} could not be uploaded. Your unsuccessful photos are still in the preview, so you can try uploading them again.`,
                "error"
            );

        } else {

            showMessage(
                "We couldn't upload your photos. Your selected photos are still in the preview. Please check your connection and try again.",
                "error"
            );

        }

    } catch (error) {

        console.error(
            "Unexpected upload error:",
            error
        );

        showMessage(
            "Something went wrong. Your selected photos have been preserved. Please try again.",
            "error"
        );

    } finally {

        isUploading = false;

        updateUploadButton();

        uploadProgress.classList.add("hidden");

    }

}


uploadForm.addEventListener(
    "submit",
    uploadPhotos
);


/* =========================================
   12. GENERATE PUBLIC PHOTO URL
========================================= */

function getPhotoURL(path) {

    const { data } =
        supabaseClient
            .storage
            .from(PHOTO_BUCKET)
            .getPublicUrl(path);

    return data.publicUrl;

}


/* =========================================
   13. DISPLAY GALLERY PHOTOS
========================================= */

function renderGallery(photos, append = false) {

    if (!append) {

        galleryGrid.innerHTML = "";

    }

    if (
        photos.length === 0 &&
        !append
    ) {

        galleryGrid.innerHTML = `
            <div class="gallery-placeholder">
                Our shared album is waiting for its first memories.
            </div>
        `;

        return;

    }

    photos.forEach(function (photo) {

        const wrapper =
            document.createElement("div");

        wrapper.className = "gallery-item";

        const image =
            document.createElement("img");

        image.src =
            getPhotoURL(photo.storage_path);

        image.alt =
            "Wedding memory shared by " +
            photo.guest_name;

        image.loading = "lazy";

        image.decoding = "async";

        const info =
            document.createElement("div");

        info.className = "gallery-item-info";

        const name =
            document.createElement("strong");

        name.textContent =
            photo.guest_name;

        const date =
            document.createElement("span");

        date.textContent =
            formatDate(photo.created_at);

        info.appendChild(name);

        info.appendChild(date);

        if (photo.caption) {

            const caption =
                document.createElement("span");

            caption.textContent =
                photo.caption;

            info.appendChild(caption);

        }

        wrapper.appendChild(image);

        wrapper.appendChild(info);

        wrapper.addEventListener(
            "click",
            function () {

                openLightbox(photo.id);

            }
        );

        galleryGrid.appendChild(wrapper);

    });

}


/* =========================================
   14. LOAD GALLERY
========================================= */

async function loadGallery(reset = false) {

    if (isLoadingGallery) return;

    isLoadingGallery = true;

    if (reset) {

        currentPage = 0;

        hasMorePhotos = true;

        galleryPhotos = [];

    }

    if (!hasMorePhotos) {

        isLoadingGallery = false;

        return;

    }

    try {

        const from =
            currentPage * PAGE_SIZE;

        const to =
            from + PAGE_SIZE - 1;

        const { data, error } =
            await supabaseClient
                .from("WeddingPhotos")
                .select(
                    "id, guest_name, caption, storage_path, created_at"
                )
                .order(
                    "created_at",
                    { ascending: false }
                )
                .range(from, to);

        if (error) throw error;

        if (reset) {

            galleryPhotos = data;

            renderGallery(data);

        } else {

            galleryPhotos =
                galleryPhotos.concat(data);

            renderGallery(data, true);

        }

        currentPage++;

        hasMorePhotos =
            data.length === PAGE_SIZE;

        galleryCount.textContent =
            `${galleryPhotos.length} memories shared`;

        loadMoreButton.classList.toggle(
            "hidden",
            !hasMorePhotos
        );

    } catch (error) {

        console.error(
            "Gallery loading error:",
            error
        );

        if (reset) {

            galleryGrid.innerHTML = `
                <div class="gallery-placeholder">
                    Unable to load the gallery.
                    Please refresh the page.
                </div>
            `;

            galleryCount.textContent =
                "Unable to load memories";

        }

    } finally {

        isLoadingGallery = false;

    }

}


/* =========================================
   15. LOAD MORE PHOTOS
========================================= */

loadMoreButton.addEventListener(
    "click",
    async function () {

        await loadGallery(false);

    }
);


/* =========================================
   16. REALTIME GALLERY UPDATES
========================================= */

const photoChannel =
    supabaseClient
        .channel("wedding-photo-gallery")
        .on(
            "postgres_changes",
            {
                event: "INSERT",

                schema: "public",

                table: "WeddingPhotos"
            },
            async function () {

                // Reload so newly uploaded photos
                // appear at the top of the gallery.

                await loadGallery(true);

            }
        )
        .subscribe();


/* =========================================
   17. LIGHTBOX
========================================= */

function openLightbox(photoID) {

    currentLightboxIndex =
        galleryPhotos.findIndex(
            function (photo) {

                return photo.id === photoID;

            }
        );

    if (currentLightboxIndex < 0) return;

    showLightboxPhoto();

    lightbox.classList.add("active");

    document.body.style.overflow = "hidden";

}


function showLightboxPhoto() {

    const photo =
        galleryPhotos[currentLightboxIndex];

    if (!photo) return;

    lightboxImage.src =
        getPhotoURL(photo.storage_path);

    lightboxCaption.textContent =
        photo.guest_name +
        (photo.caption
            ? " · " + photo.caption
            : "");

}


function closeLightbox() {

    lightbox.classList.remove("active");

    lightboxImage.src = "";

    document.body.style.overflow = "";

}


function changeLightboxPhoto(direction) {

    if (galleryPhotos.length === 0) return;

    currentLightboxIndex =
        (
            currentLightboxIndex +
            direction +
            galleryPhotos.length
        ) % galleryPhotos.length;

    showLightboxPhoto();

}


lightboxClose.addEventListener(
    "click",
    closeLightbox
);


lightboxPrev.addEventListener(
    "click",
    function () {

        changeLightboxPhoto(-1);

    }
);


lightboxNext.addEventListener(
    "click",
    function () {

        changeLightboxPhoto(1);

    }
);


lightbox.addEventListener(
    "click",
    function (event) {

        if (event.target === lightbox) {

            closeLightbox();

        }

    }
);


document.addEventListener(
    "keydown",
    function (event) {

        if (!lightbox.classList.contains("active")) {
            return;
        }

        if (event.key === "Escape") {

            closeLightbox();

        }

        if (event.key === "ArrowLeft") {

            changeLightboxPhoto(-1);

        }

        if (event.key === "ArrowRight") {

            changeLightboxPhoto(1);

        }

    }
);


/* =========================================
   18. INITIALIZE
========================================= */

async function initializeGallery() {

    await loadGallery(true);

}

initializeGallery();
