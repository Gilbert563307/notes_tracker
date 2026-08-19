import { useState } from "react";
import { Show } from "../../../show/Show";
import ReactPaginate from "react-paginate";
import { PAGE_CHANGED_EVENT, PAGE_NUMBER } from "../../../../../config/config";

export default function BS5PaginationV2({
  totalItems = 0,
  totalPages,
  loadOptionsIcons = false,
}: {
  totalItems: number;
  totalPages: number;
  loadOptionsIcons: boolean;
}) {
  const currentUrl: URL = new URL(window.location.href);
  function getInitialForcePage() {
    return currentUrl.searchParams.get(PAGE_NUMBER) || 1;
  }

  const [forcePage, setForcePage] = useState(getInitialForcePage());
  const nextLabelHtml = '<i class="fa-regular fa-chevrons-right" style="color: #0143a3;"></i>';
  const backLabelHtml = '<i class="fa-regular fa-chevrons-left" style="color: #0143a3;"></i>';

  // Invoke when user click to request another page.
  function handlePageClick(event: Event) {
    const pageNumber = event.selected + 1;
    paginate(pageNumber);
    //Forces the page number to go the clicked number because when the user changes the items per page, the current page number was not highlighted
    if (totalItems != undefined && pageNumber < totalItems) {
      setForcePage(pageNumber - 1);
    }
  }

  function resetReactPaginate() {
    //get page number param from the url
    const pageNumberParam = currentUrl.searchParams.get(PAGE_NUMBER);
    //This checks if the total pages have changed
    if (
      totalPages &&
      //check if the pageNumber param is the url
      pageNumberParam != null &&
      //check if the total pages are smaller or equals to the pagenumber param
      totalPages <= parseInt(pageNumberParam)
    ) {
      //if all the above is true, force the react paginate page to the pagenumber thats in the url
      setForcePage(parseInt(pageNumberParam) - 1);
      return;
    }

    //do nothing when total pages less than one
    if (totalPages <= 1) return;

    //when the total items change for the page back to zero index
    setForcePage(0);
    //set the use back to page one

    paginate(1);
  }

  resetReactPaginate();

  function paginate(page: number) {
    if (!page) return;
    const url: URL = new URL(window.location.href);
    url.searchParams.set(PAGE_NUMBER, String(page));
    history.replaceState(history.state, "", url.href);

    const event = new CustomEvent(PAGE_CHANGED_EVENT, {
      detail: {
        page: page,
      },
    });
    document.dispatchEvent(event);
  }

  return (
    <div>
      <Show>
        <Show.When isTrue={totalPages > 1}>
          <Show>
            <Show.When isTrue={totalItems != null}>
              <span className="mx-1">Total results: {totalItems}</span>
            </Show.When>
          </Show>

          <nav aria-label="Page navigation" className="mt-2 dialogic-pagination">
            <ReactPaginate
              forcePage={forcePage}
              className="pagination"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              breakLabel="..."
              pageCount={totalPages}
              breakClassName="page-item"
              breakLinkClassName="page-link"
              nextLabel={!loadOptionsIcons ? "Next" : <span dangerouslySetInnerHTML={{ __html: nextLabelHtml }} />}
              onPageChange={handlePageClick}
              pageRangeDisplayed={4}
              previousLabel={
                !loadOptionsIcons ? "Previous" : <span dangerouslySetInnerHTML={{ __html: backLabelHtml }}></span>
              }
              renderOnZeroPageCount={null}
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              activeClassName="active"
            />
          </nav>
        </Show.When>
      </Show>
    </div>
  );
}
