import { GetStaticProps } from "next"
import Header from "../../components/Header"
import {sanityClient , urlFor } from "../../sanity"
import { Post } from '../../typing'
import PortableText from 'react-portable-text'
import {useForm , SubmitHandler} from "react-hook-form"
import { useState } from "react"
import Head from "next/head"

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props { 
  post: Post;
}
function Post({ post }: Props) {
  const [ submitted, setSubmitted ] = useState(false);
  const { register , 
          handleSubmit , 
          formState: { errors }, 
        } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch("/api/createComment" , { 
      method:"POST", 
      body: JSON.stringify(data) 
    }).then (() =>{
      setSubmitted(true);
    } ).catch((err) => {
        setSubmitted(false);
      });
  }
  return (
    <main>
       <Head>
          <title>{post.title}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />
        <img
        className="w-full h-60 object-cover"
        src={urlFor(post.mainImage).url()} alt="" />
        <article className="max-w-3xl mx-auto p-5">
          <h1 className="text-3xl mt-10 mb-3"> {post.title}</h1>
          <h2 className="text-xl font-light text-gray-500 mb-2"> 
          {post.description}
          </h2>
          <div className="flex items-center space-x-2">
            <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()} alt="" />
            <p className="font-extralight text-sm">
              Blog Post By {" "} 
              <span className="text-green-600"> {post.author.name} </span> -
               Published at {new Date(post._createdAt).toLocaleString()}
            </p>
          </div>
          <div className="mt-10"> <br />
          <PortableText 
          className=""
           dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
           projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
           content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
             h2: (props: any) => (
                <h1 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
               <a href={href} className="Otext-blue-500 hover: underline">
                  {children}
                </a> 
              ),
            }}
          />
          </div>
        </article>
        <hr className="max-w-lg mx-auto border border-yellow-500" />
         {submitted ? (
           <div className="flex flex-col p-10 my-10 bg-yellow-500 Itext-white
           max-w-2xl mx-auto">
             <h3 className="text-3x font-bold">
               Waad ku mahad san tahay fikirka aad nala wadaagtay
             </h3>
             <p>Marka lasoo aqbalo wexey kasoo muuqan doontaa meesha hoose shukran!</p>
           </div>
         ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5 max-w-2xl mx-auto mb-10">
          <h3 className="text-sm Itext-yellow-500">warbixintaan maka heshay ?</h3>
            <h4 className="text-3xl font-bold">Fikirkaaga nala wadaag walaal!</h4>
            <hr className="py-3 mt-2" />
                <input
                    {...register("_id")}
                    type="hidden"
                    name="_id"
                    value={post._id}
                  />
              <label className="block mb-5">
              <span className="Otext-gray-700">Name</span>
              <input
              {...register("name" , {required: true})}
                className="shadow border rounded py-2 px-3 form-input mt-1 block
                w-full Iring-yellow-500"
                placeholder="Full Name"
                type="text"
              />
            </label>
            <label className="block mb-5">
              <span className="O text-gray-780">Email </span>
              <input
              {...register("email" , {required: true})}
                className="shadow border rounded py-2 px-3 form-input mt-1 block
                w-full Iring-yellow-500"
                placeholder="Email Address"
                type="text"
              />
            </label>
            <label className="block mb-5">
              <span className="Otext-gray-780">Comment</span>
              <textarea
              {...register("comment" , {required: true})}
                className="shadow border rounded py-2 px-3 form-textarea mt-1 block
                w-full Iring-yellow-500 outline-none focus:ring ring-0"
                placeholder="Comments"
                rows={8}
              />
            </label>
            <div className="flex flex-col p-5">
              {errors.name && (
                <span className="text-red-500">- Magaca waa qasab inaa galisa halkan</span>
              )}
              {errors.comment && (
                <span className="text-red-500">
                   Fikirkaaga ku qor halkan fadlan
                </span>
              )}
              {errors.email && (
                <span className="Itext-red-500">- Fadlan halkan gali email kaga hana ka baqin cidna lawadaagi meyno</span>
              )}
              </div>
              <input
              type="submit"
              className="shadow bg-yellow-500
              hover:bg-yellow-400 focus:shadow-out line
                focus:outline-none text-white font-bold py-2
              px-4 rounded cursor-pointer"
              />
               
          </form>
         )}
         <div className=" flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500
          shadow space-y-2">
            <h3 className="text-4xl">Comments</h3>
            <hr className="pb-2" />
            {post.comments.map((comment) => (
              <div key={comment._id}>
                <p>
                  <span className="text-yellow-500">{comment.name}: </span>
                  {comment.comment}
                </p>
              </div>
            )) }
          </div>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
    const query = `*[_type == "post"] {
        _id,
        slug {
            current
        }
      }`;

      const posts = await sanityClient.fetch(query) ;

      const paths = posts.map((post: Post) => ({
         params: {
           slug: post.slug.current
         },
      }));
     
      return {
        paths,
        fallback: false,
      }; 
};
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{ 
    _id,
    _createdAt,
    title,
    author-> {
      name,
      image
    },
    'comments': *[
      _type == "comment" &&
      post._ref == ^._id &&
      approved == true ],
    description,
    mainImage,
    slug,
    body
  }`;
      const post = await sanityClient.fetch(query, { 
        slug: params?.slug,
      });

      if (!post) {
        return {
          notFound: true,
         }
        };
     
      return  { props: { post } 
      }
      
}
