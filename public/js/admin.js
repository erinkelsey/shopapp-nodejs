
/**
 * Delete a product on the server through a fetch request. 
 * 
 * Removes the product from the DOM, if request is successful. 
 * 
 * @param {Button} btn the delete button that was clicked
 */
const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector('[name=productId]').value
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value

  const productElement = btn.closest('article')

  fetch('/admin/product/' + prodId, {
    method: 'DELETE',
    headers: { 
      'csrf-token': csrf
     }
  })
  .then(() => {
    productElement.remove()
  })
  .catch(err => console.log(err)) 
}

