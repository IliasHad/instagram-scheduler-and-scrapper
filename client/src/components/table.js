import React from "react"


export const Table = ({posts}) => {



  



    return (

        <div class="flex flex-col">
  <div class="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
    <div class="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
      <table class="min-w-full">
        <thead>



          <tr>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Usernmae
            </th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Id
            </th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
          </tr>
        </thead>
        <tbody class="bg-white">
        {posts.map(post => 

          <tr>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img class="h-10 w-10 rounded-full" src={post.username_img} alt="" />
                </div>
                <div class="ml-4">
        <div class="text-sm leading-5 font-medium text-gray-900">{post.username}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
        <div class="text-sm leading-5 text-gray-900">{post.id}</div>
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
            
            {post.isPusblish === true ? 
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Published
              </span>

              :
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
              Scheduled
            </span>
          }
          

             
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
              Owner
            </td>
            <td class="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
              <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit</a>
            </td>
          </tr>
          
          )}

        </tbody>
      </table>
    </div>
  </div>
</div>
    )
}