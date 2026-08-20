// Finished projects shown in the gallery grid under the Projects banner.
// Photos live in public/images/projects/gallery/project-<id>/NN.jpg and are
// displayed in filename order; NN=01 doubles as the card thumbnail.
export type GalleryProject = {
  id: string;
  images: string[];
};

function project(id: string, photoCount: number): GalleryProject {
  return {
    id,
    images: Array.from({ length: photoCount }, (_, i) => {
      const n = String(i + 1).padStart(2, "0");
      return `/images/projects/gallery/project-${id}/${n}.jpg`;
    }),
  };
}

export const galleryProjects: GalleryProject[] = [
  project("01", 19),
  project("02", 11),
  project("03", 14),
  project("04", 8),
  project("05", 6),
  project("06", 10),
];
