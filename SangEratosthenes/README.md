# Sàng Eratosthenes

## Định nghĩa

Sàng Eratosthenes là một thuật toán để tìm tất cả các số nguyên tố trong đoạn $[1;n]$ sử dụng $O(n \log \log n)$ phép toán.

Thuật toán rất đơn giản: ban đầu chúng ta viết tất cả các số từ 2 đến $n$. Chúng ta đánh dấu tất cả các bội thực sự của 2 (vì 2 là số nguyên tố nhỏ nhất) là hợp số. Một bội thực sự của số $x$ là một số lớn hơn $x$ và chia hết cho $x$. Sau đó chúng ta tìm số tiếp theo chưa được đánh dấu là hợp số, trong trường hợp này là 3. Điều này có nghĩa 3 là số nguyên tố, và chúng ta đánh dấu tất cả các bội thực sự của 3 là hợp số. Số chưa được đánh dấu tiếp theo là 5, đây là số nguyên tố tiếp theo, và chúng ta đánh dấu tất cả các bội thực sự của nó. Và chúng ta tiếp tục quy trình này cho đến khi đã xử lý tất cả các số trong dãy.

Trong hình dưới đây bạn có thể thấy một minh họa của thuật toán để tính tất cả các số nguyên tố trong khoảng $[1; 16]$. Có thể thấy rằng khá thường xuyên chúng ta đánh dấu các số là hợp số nhiều lần.

![Sàng Eratosthenes](https://cp-algorithms.com/algebra/sieve_eratosthenes.png)

Ý tưởng đằng sau là: Một số là nguyên tố nếu không có số nguyên tố nhỏ hơn nào chia hết nó. Vì chúng ta lặp qua các số nguyên tố theo thứ tự, chúng ta đã đánh dấu tất cả các số chia hết cho ít nhất một trong các số nguyên tố là chia hết. Do đó nếu chúng ta đến một ô và nó không được đánh dấu, thì nó không chia hết cho bất kỳ số nguyên tố nhỏ hơn nào và do đó phải là số nguyên tố.

## Cài đặt

```cpp
int n;
vector<bool> is_prime(n+1, true);
is_prime[0] = is_prime[1] = false;
for (int i = 2; i <= n; i++) {
    if (is_prime[i] && (long long)i * i <= n) {
        for (int j = i * i; j <= n; j += i)
            is_prime[j] = false;
    }
}
```

**Python:**
```python
def sieve_of_eratosthenes(n):
    """Sàng Eratosthenes cơ bản"""
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, n + 1):
        if is_prime[i] and i * i <= n:
            for j in range(i * i, n + 1, i):
                is_prime[j] = False
    
    return is_prime
```

Mã này đầu tiên đánh dấu tất cả các số trừ 0 và 1 là các số nguyên tố tiềm năng, sau đó nó bắt đầu quá trình sàng các hợp số. Để làm điều này, nó lặp qua tất cả các số từ $2$ đến $n$. Nếu số hiện tại $i$ là số nguyên tố, nó đánh dấu tất cả các số là bội của $i$ là hợp số, bắt đầu từ $i^2$. Đây đã là một tối ưu hóa so với cách ngây thơ để cài đặt nó, và được cho phép vì tất cả các số nhỏ hơn là bội của $i$ cũng có một thừa số nguyên tố nhỏ hơn $i$, vì vậy tất cả chúng đã được sàng trước đó. Vì $i^2$ có thể dễ dàng tràn kiểu `int`, việc kiểm tra bổ sung được thực hiện bằng kiểu `long long` trước vòng lặp lồng thứ hai.

Sử dụng cách cài đặt như vậy, thuật toán tiêu thụ $O(n)$ bộ nhớ (rõ ràng) và thực hiện $O(n \log \log n)$ (xem phần tiếp theo).

## Phân tích tiệm cận

Rất đơn giản để chứng minh thời gian chạy $O(n \log n)$ mà không cần biết gì về phân bố của các số nguyên tố - bỏ qua kiểm tra `is_prime`, vòng lặp bên trong chạy (nhiều nhất) $n/i$ lần cho $i = 2, 3, 4, \dots$, dẫn đến tổng số phép toán trong vòng lặp bên trong là một tổng điều hòa như $n(1/2 + 1/3 + 1/4 + \cdots)$, bị chặn bởi $O(n \log n)$.

Hãy chứng minh rằng thời gian chạy của thuật toán là $O(n \log \log n)$. Thuật toán sẽ thực hiện $\frac{n}{p}$ phép toán cho mỗi số nguyên tố $p \le n$ trong vòng lặp bên trong. Do đó, chúng ta cần đánh giá biểu thức sau:

$$\sum_{\substack{p \le n, \\\ p \text{ nguyên tố}}} \frac n p = n \cdot \sum_{\substack{p \le n, \\\ p \text{ nguyên tố}}} \frac 1 p.$$

Hãy nhớ lại hai sự kiện đã biết:

• Số lượng số nguyên tố nhỏ hơn hoặc bằng $n$ xấp xỉ $\frac n {\ln n}$.
• Số nguyên tố thứ $k$ xấp xỉ bằng $k \ln k$ (điều này suy ra từ sự kiện trước).

Do đó chúng ta có thể viết tổng theo cách sau:

$$\sum_{\substack{p \le n, \\\ p \text{ nguyên tố}}} \frac 1 p \approx \frac 1 2 + \sum_{k = 2}^{\frac n {\ln n}} \frac 1 {k \ln k}.$$

Ở đây chúng ta đã tách số nguyên tố đầu tiên 2 ra khỏi tổng, vì $k = 1$ trong xấp xỉ $k \ln k$ là $0$ và gây ra phép chia cho 0.

Bây giờ, hãy đánh giá tổng này bằng tích phân của cùng một hàm theo $k$ từ $2$ đến $\frac n {\ln n}$ (chúng ta có thể thực hiện xấp xỉ như vậy vì, thực tế, tổng liên quan đến tích phân như xấp xỉ của nó sử dụng phương pháp hình chữ nhật):

$$\sum_{k = 2}^{\frac n {\ln n}} \frac 1 {k \ln k} \approx \int_2^{\frac n {\ln n}} \frac 1 {k \ln k} dk.$$

Nguyên hàm của hàm dưới tích phân là $\ln \ln k$. Sử dụng phép thế và loại bỏ các số hạng bậc thấp hơn, chúng ta sẽ có kết quả:

$$\int_2^{\frac n {\ln n}} \frac 1 {k \ln k} dk = \ln \ln \frac n {\ln n} - \ln \ln 2 = \ln(\ln n - \ln \ln n) - \ln \ln 2 \approx \ln \ln n.$$

Bây giờ, quay trở lại tổng ban đầu, chúng ta sẽ có đánh giá xấp xỉ của nó:

$$\sum_{\substack{p \le n, \\\ p \text{ nguyên tố}}} \frac n p \approx n \ln \ln n + o(n).$$

Bạn có thể tìm thấy một chứng minh chặt chẽ hơn (cho đánh giá chính xác hơn trong các thừa số hằng số) trong cuốn sách của Hardy & Wright "An Introduction to the Theory of Numbers" (trang 349).

## Các tối ưu hóa khác nhau của Sàng Eratosthenes

Điểm yếu lớn nhất của thuật toán là nó "đi bộ" dọc theo bộ nhớ nhiều lần, chỉ thao tác các phần tử đơn lẻ. Điều này không thân thiện với cache. Và vì điều đó, hằng số được che giấu trong $O(n \log \log n)$ tương đối lớn.

Bên cạnh đó, bộ nhớ tiêu thụ là một nút cổ chai cho $n$ lớn.

Các phương pháp được trình bày dưới đây cho phép chúng ta giảm số lượng phép toán được thực hiện, cũng như rút ngắn bộ nhớ tiêu thụ đáng kể.

### Sàng đến căn

Rõ ràng, để tìm tất cả các số nguyên tố đến $n$, sẽ đủ chỉ thực hiện sàng bởi các số nguyên tố không vượt quá căn của $n$.

```cpp
int n;
vector<bool> is_prime(n+1, true);
is_prime[0] = is_prime[1] = false;
for (int i = 2; i * i <= n; i++) {
    if (is_prime[i]) {
        for (int j = i * i; j <= n; j += i)
            is_prime[j] = false;
    }
}
```

**Python:**
```python
def sieve_optimized(n):
    """Sàng Eratosthenes tối ưu - chỉ sàng đến căn n"""
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    i = 2
    while i * i <= n:
        if is_prime[i]:
            for j in range(i * i, n + 1, i):
                is_prime[j] = False
        i += 1
    
    return is_prime
```

Tối ưu hóa như vậy không ảnh hưởng đến độ phức tạp (thực sự, bằng cách lặp lại chứng minh được trình bày ở trên, chúng ta sẽ có đánh giá $n \ln \ln \sqrt n + o(n)$, về mặt tiệm cận là giống nhau theo các tính chất của logarit), mặc dù số lượng phép toán sẽ giảm đáng kể.

### Sàng chỉ bởi các số lẻ

Vì tất cả các số chẵn (trừ $2$) đều là hợp số, chúng ta có thể ngừng kiểm tra các số chẵn hoàn toàn. Thay vào đó, chúng ta cần hoạt động chỉ với các số lẻ.

Đầu tiên, nó sẽ cho phép chúng ta giảm một nửa bộ nhớ cần thiết. Thứ hai, nó sẽ giảm số lượng phép toán được thực hiện bởi thuật toán khoảng một nửa.

### Tiêu thụ bộ nhớ và tốc độ của các phép toán

Chúng ta nên chú ý rằng hai cách cài đặt Sàng Eratosthenes này sử dụng $n$ bit bộ nhớ bằng cách sử dụng cấu trúc dữ liệu `vector<bool>`. `vector<bool>` không phải là một container thông thường lưu trữ một chuỗi `bool` (như trong hầu hết các kiến trúc máy tính, một `bool` chiếm một byte bộ nhớ). Đó là một chuyên môn hóa tối ưu bộ nhớ của `vector<T>`, chỉ tiêu thụ $\frac{N}{8}$ byte bộ nhớ.

Các kiến trúc bộ xử lý hiện đại hoạt động hiệu quả hơn nhiều với byte hơn với bit vì chúng thường không thể truy cập bit trực tiếp. Vì vậy, bên dưới `vector<bool>` lưu trữ các bit trong một bộ nhớ liên tục lớn, truy cập bộ nhớ theo khối vài byte, và trích xuất/đặt các bit bằng các phép toán bit như bit masking và bit shifting.

Do đó có một chi phí nhất định khi bạn đọc hoặc ghi bit với `vector<bool>`, và khá thường xuyên việc sử dụng `vector<char>` (sử dụng 1 byte cho mỗi mục, do đó 8x lượng bộ nhớ) nhanh hơn.

Tuy nhiên, đối với các cài đặt đơn giản của Sàng Eratosthenes, việc sử dụng `vector<bool>` nhanh hơn. Bạn bị giới hạn bởi tốc độ có thể tải dữ liệu vào cache, và do đó việc sử dụng ít bộ nhớ hơn mang lại lợi thế lớn. Một benchmark ([link](https://gist.github.com/jakobkogler/e6359ea9ced24fe304f1a8af3c9bee0e)) cho thấy việc sử dụng `vector<bool>` nhanh hơn từ 1.4x đến 1.7x so với việc sử dụng `vector<char>`.

Những cân nhắc tương tự cũng áp dụng cho `bitset`. Nó cũng là một cách hiệu quả để lưu trữ bit, tương tự như `vector<bool>`, vì vậy nó chỉ chiếm $\frac{N}{8}$ byte bộ nhớ, nhưng chậm hơn một chút trong việc truy cập các phần tử. Trong benchmark trên, `bitset` hoạt động kém hơn một chút so với `vector<bool>`. Một nhược điểm khác của `bitset` là bạn cần biết kích thước tại thời điểm biên dịch.

### Sàng phân đoạn

Từ tối ưu hóa "sàng đến căn" suy ra rằng không cần phải giữ toàn bộ mảng `is_prime[1...n]` tại tất cả thời điểm. Để sàng, chỉ cần giữ các số nguyên tố đến căn của $n$, tức là `prime[1... sqrt(n)]`, chia phạm vi hoàn chỉnh thành các khối, và sàng từng khối riêng biệt.

Cho $s$ là một hằng số xác định kích thước của khối, thì chúng ta có $\lceil {\frac n s} \rceil$ khối tổng cộng, và khối $k$ ($k = 0 ... \lfloor {\frac n s} \rfloor$) chứa các số trong đoạn $[ks; ks + s - 1]$. Chúng ta có thể làm việc trên các khối theo lượt, tức là với mỗi khối $k$, chúng ta sẽ đi qua tất cả các số nguyên tố (từ $1$ đến $\sqrt n$) và thực hiện sàng sử dụng chúng. Đáng chú ý rằng chúng ta phải sửa đổi chiến lược một chút khi xử lý các số đầu tiên: đầu tiên, tất cả các số nguyên tố từ $[1; \sqrt n]$ không nên loại bỏ chính chúng; và thứ hai, các số $0$ và $1$ nên được đánh dấu là số không nguyên tố. Khi làm việc trên khối cuối cùng, không nên quên rằng số cuối cùng cần thiết $n$ không nhất thiết nằm ở cuối khối.

Như đã thảo luận trước đó, cài đặt điển hình của Sàng Eratosthenes bị giới hạn bởi tốc độ bạn có thể tải dữ liệu vào cache CPU. Bằng cách chia phạm vi các số nguyên tố tiềm năng $[1; n]$ thành các khối nhỏ hơn, chúng ta không bao giờ phải giữ nhiều khối trong bộ nhớ cùng một lúc, và tất cả các phép toán thân thiện với cache hơn nhiều. Vì bây giờ chúng ta không còn bị giới hạn bởi tốc độ cache, chúng ta có thể thay thế `vector<bool>` bằng `vector<char>`, và đạt được một số hiệu suất bổ sung vì các bộ xử lý có thể xử lý đọc và ghi với byte trực tiếp và không cần dựa vào các phép toán bit để trích xuất từng bit riêng lẻ. Benchmark ([link](https://gist.github.com/jakobkogler/e6359ea9ced24fe304f1a8af3c9bee0e)) cho thấy việc sử dụng `vector<char>` nhanh hơn khoảng 3x trong tình huống này so với việc sử dụng `vector<bool>`. Một lời cảnh báo: những con số đó có thể khác nhau tùy thuộc vào kiến trúc, trình biên dịch và mức độ tối ưu hóa.

Đây là một cài đặt đếm số lượng số nguyên tố nhỏ hơn hoặc bằng $n$ sử dụng sàng khối:

```cpp
int count_primes(int n) {
    const int S = 10000;

    vector<int> primes;
    int nsqrt = sqrt(n);
    vector<char> is_prime(nsqrt + 2, true);
    for (int i = 2; i <= nsqrt; i++) {
        if (is_prime[i]) {
            primes.push_back(i);
            for (int j = i * i; j <= nsqrt; j += i)
                is_prime[j] = false;
        }
    }

    int result = 0;
    vector<char> block(S);
    for (int k = 0; k * S <= n; k++) {
        fill(block.begin(), block.end(), true);
        int start = k * S;
        for (int p : primes) {
            int start_idx = (start + p - 1) / p;
            int j = max(start_idx, p) * p - start;
            for (; j < S; j += p)
                block[j] = false;
        }
        if (k == 0)
            block[0] = block[1] = false;
        for (int i = 0; i < S && start + i <= n; i++) {
            if (block[i])
                result++;
        }
    }
    return result;
}
```

**Python:**
```python
def count_primes_segmented(n):
    """Đếm số nguyên tố sử dụng sàng phân đoạn"""
    import math
    
    S = 10000  # Kích thước khối
    
    # Tìm tất cả số nguyên tố đến sqrt(n)
    nsqrt = int(math.sqrt(n))
    is_prime = [True] * (nsqrt + 2)
    is_prime[0] = is_prime[1] = False
    
    primes = []
    for i in range(2, nsqrt + 1):
        if is_prime[i]:
            primes.append(i)
            for j in range(i * i, nsqrt + 1, i):
                is_prime[j] = False
    
    result = 0
    k = 0
    while k * S <= n:
        # Khởi tạo khối
        block = [True] * S
        start = k * S
        
        # Sàng khối bằng các số nguyên tố đã tìm
        for p in primes:
            start_idx = (start + p - 1) // p
            j = max(start_idx, p) * p - start
            while j < S:
                block[j] = False
                j += p
        
        # Xử lý trường hợp đặc biệt cho khối đầu tiên
        if k == 0:
            if len(block) > 0:
                block[0] = False
            if len(block) > 1:
                block[1] = False
        
        # Đếm số nguyên tố trong khối
        for i in range(S):
            if start + i <= n and block[i]:
                result += 1
        
        k += 1
    
    return result
```

Thời gian chạy của sàng khối giống như sàng Eratosthenes thông thường (trừ khi kích thước của các khối rất nhỏ), nhưng bộ nhớ cần thiết sẽ rút ngắn thành $O(\sqrt{n} + S)$ và chúng ta có kết quả cache tốt hơn. Mặt khác, sẽ có một phép chia cho mỗi cặp khối và số nguyên tố từ $[1; \sqrt{n}]$, và điều đó sẽ tệ hơn nhiều cho kích thước khối nhỏ hơn. Do đó, cần phải giữ cân bằng khi chọn hằng số $S$. Chúng ta đạt được kết quả tốt nhất cho kích thước khối từ $10^4$ đến $10^5$.

## Tìm số nguyên tố trong khoảng

Đôi khi chúng ta cần tìm tất cả các số nguyên tố trong một khoảng $[L,R]$ có kích thước nhỏ (ví dụ $R - L + 1 \approx 1e7$), trong đó $R$ có thể rất lớn (ví dụ $1e12$).

Để giải quyết bài toán như vậy, chúng ta có thể sử dụng ý tưởng của Sàng phân đoạn. Chúng ta tạo trước tất cả các số nguyên tố đến $\sqrt R$, và sử dụng những số nguyên tố đó để đánh dấu tất cả các hợp số trong đoạn $[L, R]$.

```cpp
vector<char> segmentedSieve(long long L, long long R) {
    // tạo tất cả số nguyên tố đến sqrt(R)
    long long lim = sqrt(R);
    vector<char> mark(lim + 1, false);
    vector<long long> primes;
    for (long long i = 2; i <= lim; ++i) {
        if (!mark[i]) {
            primes.emplace_back(i);
            for (long long j = i * i; j <= lim; j += i)
                mark[j] = true;
        }
    }

    vector<char> isPrime(R - L + 1, true);
    for (long long i : primes)
        for (long long j = max(i * i, (L + i - 1) / i * i); j <= R; j += i)
            isPrime[j - L] = false;
    if (L == 1)
        isPrime[0] = false;
    return isPrime;
}
```

**Python:**
```python
def segmented_sieve(L, R):
    """Sàng phân đoạn cho khoảng [L, R]"""
    import math
    
    # Tạo tất cả số nguyên tố đến sqrt(R)
    lim = int(math.sqrt(R))
    mark = [False] * (lim + 1)
    primes = []
    
    for i in range(2, lim + 1):
        if not mark[i]:
            primes.append(i)
            for j in range(i * i, lim + 1, i):
                mark[j] = True
    
    # Sàng trong khoảng [L, R]
    is_prime = [True] * (R - L + 1)
    
    for p in primes:
        # Tìm bội nhỏ nhất của p trong khoảng [L, R]
        start = max(p * p, (L + p - 1) // p * p)
        for j in range(start, R + 1, p):
            is_prime[j - L] = False
    
    if L == 1:
        is_prime[0] = False
    
    return is_prime
```

Độ phức tạp thời gian của cách tiếp cận này là $O((R - L + 1) \log \log (R) + \sqrt R \log \log \sqrt R)$.

Cũng có thể chúng ta không tạo trước tất cả các số nguyên tố:

```cpp
vector<char> segmentedSieveNoPreGen(long long L, long long R) {
    vector<char> isPrime(R - L + 1, true);
    long long lim = sqrt(R);
    for (long long i = 2; i <= lim; ++i)
        for (long long j = max(i * i, (L + i - 1) / i * i); j <= R; j += i)
            isPrime[j - L] = false;
    if (L == 1)
        isPrime[0] = false;
    return isPrime;
}
```

**Python:**
```python
def segmented_sieve_no_pregen(L, R):
    """Sàng phân đoạn không tạo trước danh sách số nguyên tố"""
    import math
    
    is_prime = [True] * (R - L + 1)
    lim = int(math.sqrt(R))
    
    for i in range(2, lim + 1):
        # Tìm bội nhỏ nhất của i trong khoảng [L, R]
        start = max(i * i, (L + i - 1) // i * i)
        for j in range(start, R + 1, i):
            is_prime[j - L] = False
    
    if L == 1:
        is_prime[0] = False
    
    return is_prime
```

Rõ ràng, độ phức tạp tệ hơn, là $O((R - L + 1) \log (R) + \sqrt R)$. Tuy nhiên, nó vẫn chạy rất nhanh trong thực tế.

## Sửa đổi thời gian tuyến tính

Chúng ta có thể sửa đổi thuật toán theo cách mà nó chỉ có độ phức tạp thời gian tuyến tính. Cách tiếp cận này được mô tả trong bài viết [Sàng tuyến tính](https://cp-algorithms.com/algebra/prime-sieve-linear.html). Tuy nhiên, thuật toán này cũng có những điểm yếu riêng.

## Bài tập thực hành

• [Leetcode - Four Divisors](https://leetcode.com/problems/four-divisors/)
• [Leetcode - Count Primes](https://leetcode.com/problems/count-primes/)
• [SPOJ - Printing Some Primes](http://www.spoj.com/problems/TDPRIMES/)
• [SPOJ - A Conjecture of Paul Erdos](http://www.spoj.com/problems/HS08PAUL/)
• [SPOJ - Primal Fear](http://www.spoj.com/problems/VECTAR8/)
• [SPOJ - Primes Triangle (I)](http://www.spoj.com/problems/PTRI/)
• [Codeforces - Almost Prime](http://codeforces.com/contest/26/problem/A)
• [Codeforces - Sherlock And His Girlfriend](http://codeforces.com/contest/776/problem/B)
• [SPOJ - Namit in Trouble](http://www.spoj.com/problems/NGIRL/)
• [SPOJ - Bazinga!](http://www.spoj.com/problems/DCEPC505/)
• [Project Euler - Prime pair connection](https://www.hackerrank.com/contests/projecteuler/challenges/euler134)
• [SPOJ - N-Factorful](http://www.spoj.com/problems/NFACTOR/)
• [SPOJ - Binary Sequence of Prime Numbers](http://www.spoj.com/problems/BSPRIME/)
• [UVA 11353 - A Different Kind of Sorting](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2338)
• [SPOJ - Prime Generator](http://www.spoj.com/problems/PRIME1/)
• [SPOJ - Printing some primes (hard)](http://www.spoj.com/problems/PRIMES2/)
• [Codeforces - Nodbach Problem](https://codeforces.com/problemset/problem/17/A)
• [Codeforces - Colliders](https://codeforces.com/problemset/problem/154/B)

## Tài liệu tham khảo

Bài viết này được dịch từ [CP-Algorithms](https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html) với các thuật ngữ chuyên ngành được dịch chính xác sang tiếng Việt.
