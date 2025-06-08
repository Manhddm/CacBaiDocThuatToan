# Ngăn xếp tối thiểu / Hàng đợi tối thiểu

Trong bài viết này, chúng ta sẽ xét ba vấn đề:
- Sửa đổi ngăn xếp (stack) để có thể tìm phần tử nhỏ nhất trong ngăn xếp trong $O(1)$.
- Sửa đổi hàng đợi (queue) để làm điều tương tự.
- Ứng dụng các cấu trúc này để tìm giá trị nhỏ nhất trên mọi đoạn con độ dài cố định của một mảng trong $O(n)$.

---

## 1. Sửa đổi ngăn xếp (Minimum Stack)

Ta muốn sửa đổi ngăn xếp sao cho có thể truy xuất phần tử nhỏ nhất trong ngăn xếp trong $O(1)$, đồng thời các thao tác thêm/xóa vẫn giữ nguyên độ phức tạp.

**Ý tưởng:**
Thay vì chỉ lưu giá trị, ta lưu cặp `(giá trị, giá trị nhỏ nhất từ vị trí này trở xuống)`.

Ví dụ với C++:
```cpp
stack<pair<int, int>> st;
```

- **Thêm phần tử:**
```cpp
int new_min = st.empty() ? new_elem : min(new_elem, st.top().second);
st.push({new_elem, new_min});
```
- **Xóa phần tử:**
```cpp
int removed_element = st.top().first;
st.pop();
```
- **Lấy giá trị nhỏ nhất:**
```cpp
int minimum = st.top().second;
```

Tất cả các thao tác đều $O(1)$.

---

## 2. Sửa đổi hàng đợi (Minimum Queue)

### Phương pháp 1: Lưu trữ giá trị cần thiết

Ta chỉ lưu các phần tử cần thiết để xác định giá trị nhỏ nhất, đảm bảo hàng đợi luôn không giảm dần từ đầu đến cuối.

- **Thêm phần tử:**
  - Loại bỏ các phần tử cuối lớn hơn phần tử mới.
  - Thêm phần tử mới vào cuối.
```cpp
deque<int> q;
while (!q.empty() && q.back() > new_element)
    q.pop_back();
q.push_back(new_element);
```
- **Xóa phần tử:**
  - Nếu phần tử đầu bằng phần tử cần xóa, loại bỏ nó.
```cpp
if (!q.empty() && q.front() == remove_element)
    q.pop_front();
```
- **Lấy giá trị nhỏ nhất:**
```cpp
int minimum = q.front();
```

Mỗi phần tử chỉ bị thêm và xóa tối đa một lần, nên tổng thời gian là $O(1)$ trung bình cho mỗi thao tác.

### Phương pháp 2: Lưu chỉ số

Khi không biết giá trị phần tử cần xóa, ta lưu thêm chỉ số cho mỗi phần tử.

```cpp
deque<pair<int, int>> q;
int cnt_added = 0;
int cnt_removed = 0;

// Thêm phần tử
while (!q.empty() && q.back().first > new_element)
    q.pop_back();
q.push_back({new_element, cnt_added});
cnt_added++;

// Xóa phần tử
if (!q.empty() && q.front().second == cnt_removed)
    q.pop_front();
cnt_removed++;

// Lấy giá trị nhỏ nhất
int minimum = q.front().first;
```

### Phương pháp 3: Dùng hai ngăn xếp tối thiểu

Ta mô phỏng hàng đợi bằng hai ngăn xếp tối thiểu (`s1`, `s2`).
- Thêm phần tử vào `s1`.
- Xóa phần tử từ `s2`. Nếu `s2` rỗng, chuyển toàn bộ phần tử từ `s1` sang `s2` (đảo ngược thứ tự).
- Giá trị nhỏ nhất là min của hai ngăn xếp.

```cpp
stack<pair<int, int>> s1, s2;

// Thêm phần tử
int minimum = s1.empty() ? new_element : min(new_element, s1.top().second);
s1.push({new_element, minimum});

// Xóa phần tử
if (s2.empty()) {
    while (!s1.empty()) {
        int element = s1.top().first;
        s1.pop();
        int minimum = s2.empty() ? element : min(element, s2.top().second);
        s2.push({element, minimum});
    }
}
int remove_element = s2.top().first;
s2.pop();

// Lấy giá trị nhỏ nhất
if (s1.empty() || s2.empty())
    minimum = s1.empty() ? s2.top().second : s1.top().second;
else
    minimum = min(s1.top().second, s2.top().second);
```

---

## 3. Ứng dụng: Tìm giá trị nhỏ nhất trên mọi đoạn con độ dài cố định

Cho mảng $A$ độ dài $N$ và số $M \le N$. Hãy tìm giá trị nhỏ nhất trên mọi đoạn con liên tiếp độ dài $M$:

$$
\min_{0 \le i \le M-1} A[i], \min_{1 \le i \le M} A[i], \ldots, \min_{N-M \le i \le N-1} A[i]
$$

Ta có thể dùng bất kỳ phương pháp hàng đợi tối thiểu nào ở trên:
- Thêm $M$ phần tử đầu vào hàng đợi, lấy giá trị nhỏ nhất.
- Với mỗi phần tử tiếp theo, thêm vào hàng đợi, loại bỏ phần tử đầu, lấy giá trị nhỏ nhất.
- Tổng thời gian $O(n)$.

---

## Bài tập luyện tập
- [Queries with Fixed Length (HackerRank)](https://www.hackerrank.com/challenges/queries-with-fixed-length/problem)
- [Binary Land (CodeChef)](https://www.codechef.com/MAY20A/problems/BINLAND)

---

## Tham khảo
- [Bản gốc tiếng Anh trên CP-Algorithms](https://cp-algorithms.com/data_structures/stack_queue_modification.html)
- Bản quyền: [CC BY-SA 4.0](https://github.com/cp-algorithms/cp-algorithms/blob/main/LICENSE)

---

*Dịch và biên soạn bởi CacBaiDocThuatToan*
