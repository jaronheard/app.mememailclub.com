const featuredTestimonial = {
  body: "Upstairs I stand by the microwave counting the seconds between the corn popping & reading a poem. The dining hall is quiet as a postcard.",
  author: {
    name: "Anis Mojgani",
    handle: "mojgani",
    imageUrl:
      "https://pbs.twimg.com/profile_images/1387534984299245568/CZv5DFzN_400x400.jpg",
  },
};
const testimonials = [
  [
    [
      {
        body: `Dear Lil Wayne, Hey. I hate it when my hands smell like pennies. Do you think we're too sad for each other? Last night I dreamed the richness of gasoline, ropes of hair, canvas, that dead bird. I mean almost everyone is lonely. Almost no one's amazing. I know--how about we ride into a time that hasn't
        been invented yet. Then we'll invent music.`,
        author: {
          name: "Lauren Ireland",
          handle: "_teen_witch_",
          imageUrl:
            "https://pbs.twimg.com/profile_images/1520795109784174596/um-q70XZ_400x400.jpg",
        },
      },
    ],
  ],
  [
    [
      {
        body: `ME: MAYBE MY UNREASONABLY HIGH EXPECTATIONS ARE THE MOST CHARMING THING ABOUT ME!?
        Also me: [Collapses in heap sobbing on floor when she doesn't get any mail that day.]`,
        author: {
          name: "Ada Limón",
          handle: "adalimon",
          imageUrl:
            "https://pbs.twimg.com/profile_images/1444056640702099458/CzMSXIL__400x400.jpg",
        },
      },
      // More testimonials...
    ],
  ],
];

export default function Inspiration() {
  return (
    <div className="relative isolate pt-12 pb-16 sm:pt-16">
      <div className="mx-auto">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
            Inspiration
          </h2>
        </div>
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-10 sm:grid-cols-2">
          <figure className="sm:rounded-2xl col-span-2 hidden sm:block sm:bg-white sm:shadow-lg sm:ring-1 sm:ring-gray-900/5">
            <blockquote className="p-12 text-xl font-semibold leading-8 tracking-tight text-gray-900">
              <p>{`“${featuredTestimonial.body}”`}</p>
            </blockquote>
            <figcaption className="flex items-center gap-x-4 border-t border-gray-900/10 py-4 px-6">
              <img
                className="rounded-full h-10 w-10 flex-none bg-gray-50"
                src={featuredTestimonial.author.imageUrl}
                alt=""
              />
              <div className="flex-auto">
                <div className="font-semibold">
                  {featuredTestimonial.author.name}
                </div>
                <div className="text-gray-600">{`@${featuredTestimonial.author.handle}`}</div>
              </div>
            </figcaption>
          </figure>
          {testimonials.map((columnGroup, columnGroupIdx) => (
            <div key={columnGroupIdx} className="space-y-8">
              {columnGroup.map((column, columnIdx) => (
                <div key={columnIdx} className="space-y-8">
                  {column.map((testimonial) => (
                    <figure
                      key={testimonial.author.handle}
                      className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5"
                    >
                      <blockquote className="text-gray-900">
                        <p>{`“${testimonial.body}”`}</p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <img
                          className="rounded-full h-10 w-10 bg-gray-50"
                          src={testimonial.author.imageUrl}
                          alt=""
                        />
                        <div>
                          <div className="font-semibold">
                            {testimonial.author.name}
                          </div>
                          <div className="text-gray-600">{`@${testimonial.author.handle}`}</div>
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}